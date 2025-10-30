import { Injectable, Logger } from '@nestjs/common';
import { S3Helpers } from '../../common/s3';
import { config } from '../../common/config';

@Injectable()
export class PlotlyService {
  private readonly logger = new Logger(PlotlyService.name);
  private readonly s3Helpers: S3Helpers | null = null;
  private readonly s3Enabled: boolean = false;

  constructor() {
    // 只有在 S3 配置存在时才初始化 S3Helpers
    if (
      config.s3 &&
      config.s3.bucket &&
      config.s3.accessKeyId &&
      config.s3.secretAccessKey
    ) {
      try {
        this.s3Helpers = new S3Helpers();
        this.s3Enabled = true;
        this.logger.log('S3 存储已启用');
      } catch (error) {
        this.logger.error(`初始化 S3Helpers 失败: ${error.message}`);
        this.s3Enabled = false;
      }
    } else {
      this.logger.warn('S3 配置不完整，将使用 base64 数据返回图像');
      this.s3Enabled = false;
    }
  }

  /**
   * 计算人体压力分布
   * @param params 输入参数
   * @returns 压力分布数据
   */
  private calculatePressureDistribution(params: {
    youngs_modulus: number;
    poisson_ratio: number;
    height: number;
    weight: number;
    posture: string;
    grid_resolution: number;
  }) {
    const {
      youngs_modulus,
      poisson_ratio,
      height,
      weight,
      posture,
      grid_resolution,
    } = params;

    // 计算人体表面积 (m²) - 使用 Du Bois 公式
    const height_m = height / 100; // 转换为米
    const weight_kg = weight;
    const bsa =
      0.007184 * Math.pow(weight_kg, 0.425) * Math.pow(height_m, 0.725);

    // 根据坐姿调整接触面积和压力分布
    let contactArea: number;
    let pressureMultiplier: number;

    switch (posture) {
      case 'sitting':
        contactArea = bsa * 0.15; // 坐姿接触面积约为体表面积的15%
        pressureMultiplier = 1.2;
        break;
      case 'standing':
        contactArea = bsa * 0.08; // 站立时脚部接触面积约为体表面积的8%
        pressureMultiplier = 1.5;
        break;
      case 'lying':
        contactArea = bsa * 0.35; // 躺卧时接触面积约为体表面积的35%
        pressureMultiplier = 0.8;
        break;
      case 'walking':
        contactArea = bsa * 0.05; // 行走时单脚接触面积约为体表面积的5%
        pressureMultiplier = 2.0;
        break;
      case 'running':
        contactArea = bsa * 0.03; // 跑步时单脚接触面积约为体表面积的3%
        pressureMultiplier = 3.0;
        break;
      case 'right':
        contactArea = bsa * 0.2; // 右侧卧时接触面积约为体表面积的20%
        pressureMultiplier = 0.9;
        break;
      case 'left':
        contactArea = bsa * 0.2; // 左侧卧时接触面积约为体表面积的20%
        pressureMultiplier = 0.9;
        break;
      case 'center':
        contactArea = bsa * 0.25; // 中心姿势接触面积约为体表面积的25%
        pressureMultiplier = 1.0;
        break;
      default:
        contactArea = bsa * 0.15;
        pressureMultiplier = 1.0;
    }

    // 计算基础压力 (Pa)
    const basePressure = (weight_kg * 9.81) / contactArea; // 重力除以接触面积

    // 生成网格点
    const x = [];
    const y = [];
    const z = [];

    for (let i = 0; i < grid_resolution; i++) {
      for (let j = 0; j < grid_resolution; j++) {
        const x_val = (i / (grid_resolution - 1)) * 2 - 1; // -1 到 1
        const y_val = (j / (grid_resolution - 1)) * 2 - 1; // -1 到 1

        // 计算距离中心的距离
        const distance = Math.sqrt(x_val * x_val + y_val * y_val);

        // 根据距离和材料属性计算压力
        let pressure = 0;
        if (distance <= 1) {
          // 使用弹性力学模型计算压力分布
          const normalizedDistance = distance;
          const stressConcentration = 1 + (1 - normalizedDistance) * 0.5;
          const materialFactor =
            youngs_modulus / (1 - poisson_ratio * poisson_ratio);

          pressure =
            basePressure *
            pressureMultiplier *
            stressConcentration *
            (materialFactor / 1e9); // 归一化到合理范围
        }

        x.push(x_val);
        y.push(y_val);
        z.push(pressure);
      }
    }

    return { x, y, z, contactArea, basePressure };
  }

  /**
   * 生成压力分布可视化图表
   * @param params 输入参数
   * @returns 图表配置
   */
  private generatePressureDistributionPlot(params: {
    youngs_modulus: number;
    poisson_ratio: number;
    height: number;
    weight: number;
    posture: string;
    grid_resolution: number;
    color_scheme: string;
  }) {
    const { x, y, z, contactArea, basePressure } =
      this.calculatePressureDistribution(params);

    // 计算压力的最小值和最大值，确保颜色条从0开始
    const minPressure = Math.min(0, ...z);
    const maxPressure = Math.max(...z);

    // 创建 Plotly 数据
    const data = [
      {
        x: x,
        y: y,
        z: z,
        type: 'heatmap',
        colorscale: params.color_scheme,
        showscale: true,
        zmin: minPressure, // 设置最小值
        zmax: maxPressure, // 设置最大值
        colorbar: {
          title: '压力 (Pa)',
          titleside: 'right',
        },
        hovertemplate: 'X: %{x}<br>Y: %{y}<br>压力: %{z:.2f} Pa<extra></extra>',
      },
    ];

    // 创建布局
    const layout = {
      title: {
        text: `压力分布可视化 - ${this.getPostureDisplayName(params.posture)}`,
        font: { size: 18 },
        x: 0.5,
        xanchor: 'center',
        pad: { t: 20, b: 20 },
      },
      xaxis: {
        title: {
          text: 'X 坐标 (归一化)',
          font: { size: 14 },
          standoff: 24,
        },
        showgrid: true,
        tickfont: { size: 12 },
        titlefont: { size: 14 },
        automargin: true,
      },
      yaxis: {
        title: {
          text: 'Y 坐标 (归一化)',
          font: { size: 14 },
          standoff: 24,
        },
        showgrid: true,
        tickfont: { size: 12 },
        titlefont: { size: 14 },
        automargin: true,
      },
      annotations: [
        {
          x: 0.5,
          y: 1.08,
          xref: 'paper',
          yref: 'paper',
          text: `身高: ${params.height}cm | 体重: ${params.weight}kg | 杨氏模量: ${params.youngs_modulus.toExponential(2)}Pa | 泊松比: ${params.poisson_ratio}`,
          showarrow: false,
          align: 'center',
          font: { size: 13 },
          bgcolor: 'rgba(255,255,255,0.9)',
          bordercolor: 'rgba(0,0,0,0.1)',
          borderwidth: 1,
          borderpad: 8,
          yanchor: 'top',
        },
        {
          x: 0.5,
          y: -0.18,
          xref: 'paper',
          yref: 'paper',
          text: `接触面积: ${(contactArea * 10000).toFixed(2)} cm² | 基础压力: ${basePressure.toFixed(2)} Pa`,
          showarrow: false,
          font: { size: 13 },
          bgcolor: 'rgba(255,255,255,0.8)',
          bordercolor: 'rgba(0,0,0,0.1)',
          borderwidth: 1,
          borderpad: 8,
          yanchor: 'top',
        },
      ],
      margin: { t: 85, b: 120, l: 80, r: 110 },
      coloraxis: {
        colorbar: {
          title: {
            text: '压力 (Pa)',
            font: { size: 14 },
          },
          tickfont: { size: 12 },
          titlefont: { size: 14 },
          len: 0.8,
          y: 0.5,
          yanchor: 'middle',
        },
      },
    };

    return { data, layout };
  }

  /**
   * 生成应力分析图表
   * @param params 输入参数
   * @returns 图表配置
   */
  private generateStressAnalysisPlot(params: {
    youngs_modulus: number;
    poisson_ratio: number;
    height: number;
    weight: number;
    posture: string;
    grid_resolution: number;
    color_scheme: string;
  }) {
    const { x, y, z } = this.calculatePressureDistribution(params);

    // 计算应力分量
    const stress_xx = z.map((p) => p * (1 + params.poisson_ratio));
    const stress_yy = z.map((p) => p * (1 + params.poisson_ratio));
    const stress_xy = z.map((p) => p * params.poisson_ratio);

    // 计算主应力
    const principal_stress_1 = z.map((p, i) => {
      const sxx = stress_xx[i];
      const syy = stress_yy[i];
      const sxy = stress_xy[i];
      return (
        (sxx + syy) / 2 + Math.sqrt(Math.pow((sxx - syy) / 2, 2) + sxy * sxy)
      );
    });

    // 计算主应力的最小值和最大值
    const minStress = Math.min(0, ...principal_stress_1);
    const maxStress = Math.max(...principal_stress_1);

    const data = [
      {
        x: x,
        y: y,
        z: principal_stress_1,
        type: 'heatmap',
        colorscale: params.color_scheme,
        showscale: true,
        zmin: minStress, // 设置最小值
        zmax: maxStress, // 设置最大值
        colorbar: {
          title: '主应力 (Pa)',
          titleside: 'right',
        },
        hovertemplate:
          'X: %{x}<br>Y: %{y}<br>主应力: %{z:.2f} Pa<extra></extra>',
      },
    ];

    const layout = {
      title: {
        text: `应力分析 - ${this.getPostureDisplayName(params.posture)}`,
        font: { size: 18 },
        x: 0.5,
        xanchor: 'center',
        pad: { t: 20, b: 20 },
      },
      xaxis: {
        title: {
          text: 'X 坐标 (归一化)',
          font: { size: 14 },
          standoff: 24,
        },
        showgrid: true,
        tickfont: { size: 12 },
        titlefont: { size: 14 },
        automargin: true,
      },
      yaxis: {
        title: {
          text: 'Y 坐标 (归一化)',
          font: { size: 14 },
          standoff: 24,
        },
        showgrid: true,
        tickfont: { size: 12 },
        titlefont: { size: 14 },
        automargin: true,
      },
      annotations: [
        {
          x: 0.5,
          y: 1.08,
          xref: 'paper',
          yref: 'paper',
          text: `杨氏模量: ${params.youngs_modulus.toExponential(2)}Pa | 泊松比: ${params.poisson_ratio}`,
          showarrow: false,
          align: 'center',
          font: { size: 13 },
          bgcolor: 'rgba(255,255,255,0.9)',
          bordercolor: 'rgba(0,0,0,0.1)',
          borderwidth: 1,
          borderpad: 8,
          yanchor: 'top',
        },
      ],
      margin: { t: 85, b: 120, l: 80, r: 110 },
      coloraxis: {
        colorbar: {
          title: {
            text: '主应力 (Pa)',
            font: { size: 14 },
          },
          tickfont: { size: 12 },
          titlefont: { size: 14 },
          len: 0.8,
          y: 0.5,
          yanchor: 'middle',
        },
      },
    };

    return { data, layout };
  }

  /**
   * 生成变形分析图表
   * @param params 输入参数
   * @returns 图表配置
   */
  private generateDeformationPlot(params: {
    youngs_modulus: number;
    poisson_ratio: number;
    height: number;
    weight: number;
    posture: string;
    grid_resolution: number;
    color_scheme: string;
  }) {
    const { x, y, z } = this.calculatePressureDistribution(params);

    // 计算变形 (基于胡克定律)
    const deformation = z.map((p) => {
      const strain = p / params.youngs_modulus;
      return strain * 1000; // 转换为毫米
    });

    // 计算变形的最小值和最大值
    const minDeformation = Math.min(0, ...deformation);
    const maxDeformation = Math.max(...deformation);

    const data = [
      {
        x: x,
        y: y,
        z: deformation,
        type: 'heatmap',
        colorscale: params.color_scheme,
        showscale: true,
        zmin: minDeformation, // 设置最小值
        zmax: maxDeformation, // 设置最大值
        colorbar: {
          title: '变形 (mm)',
          titleside: 'right',
        },
        hovertemplate: 'X: %{x}<br>Y: %{y}<br>变形: %{z:.4f} mm<extra></extra>',
      },
    ];

    const layout = {
      title: {
        text: `变形分析 - ${this.getPostureDisplayName(params.posture)}`,
        font: { size: 18 },
        x: 0.5,
        xanchor: 'center',
        pad: { t: 20, b: 20 },
      },
      xaxis: {
        title: {
          text: 'X 坐标 (归一化)',
          font: { size: 14 },
          standoff: 24,
        },
        showgrid: true,
        tickfont: { size: 12 },
        titlefont: { size: 14 },
        automargin: true,
      },
      yaxis: {
        title: {
          text: 'Y 坐标 (归一化)',
          font: { size: 14 },
          standoff: 24,
        },
        showgrid: true,
        tickfont: { size: 12 },
        titlefont: { size: 14 },
        automargin: true,
      },
      annotations: [
        {
          x: 0.5,
          y: 1.08,
          xref: 'paper',
          yref: 'paper',
          text: `杨氏模量: ${params.youngs_modulus.toExponential(2)}Pa | 泊松比: ${params.poisson_ratio}`,
          showarrow: false,
          align: 'center',
          font: { size: 13 },
          bgcolor: 'rgba(255,255,255,0.9)',
          bordercolor: 'rgba(0,0,0,0.1)',
          borderwidth: 1,
          borderpad: 8,
          yanchor: 'top',
        },
      ],
      margin: { t: 85, b: 120, l: 80, r: 110 },
      coloraxis: {
        colorbar: {
          title: {
            text: '变形 (mm)',
            font: { size: 14 },
          },
          tickfont: { size: 12 },
          titlefont: { size: 14 },
          len: 0.8,
          y: 0.5,
          yanchor: 'middle',
        },
      },
    };

    return { data, layout };
  }

  /**
   * 获取坐姿显示名称
   * @param posture 坐姿代码
   * @returns 显示名称
   */
  private getPostureDisplayName(posture: string): string {
    const postureNames = {
      sitting: '坐姿',
      standing: '站立',
      lying: '躺卧',
      walking: '行走',
      running: '跑步',
      right: '右侧卧',
      left: '左侧卧',
      center: '中心姿势',
    };
    return postureNames[posture] || posture;
  }

  /**
   * 生成 Plotly 图表的静态图片（服务器环境不支持）
   * @param data 图表数据
   * @param layout 图表布局
   * @returns null（不支持图片生成）
   */
  private async generatePlotImage(data: any[], layout: any): Promise<string | null> {
    this.logger.warn('服务器环境不支持图片生成，请使用 HTML 模式');
    return null;
  }

  /**
   * 生成包含 Plotly 图表的 HTML 页面
   * @param figure Plotly 图表配置
   * @returns HTML 字符串
   */
  private generatePlotHTML(figure: any): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Plotly 可视化图表</title>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f5f5f5;
        }
        #plotly-div {
            width: 100%;
            max-width: 800px;
            height: 700px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div id="plotly-div"></div>
    <script>
        const figure = ${JSON.stringify(figure, null, 2)};
        Plotly.newPlot('plotly-div', figure.data, figure.layout, figure.config);
    </script>
</body>
</html>`;
  }

  /**
   * 执行可视化请求
   * @param params 请求参数
   * @returns 可视化结果
   */
  async executeVisualization(params: {
    youngs_modulus: number;
    poisson_ratio: number;
    height: number;
    weight: number;
    posture: string;
    visualization_type?: string;
    grid_resolution?: number;
    color_scheme?: string;
    output_mode?: 'image' | 'html' | 'both';
  }): Promise<any> {
    try {
      this.logger.log(
        `开始生成 ${params.visualization_type || 'pressure_distribution'} 可视化`,
      );

      // 设置默认值
      const processedParams: {
        youngs_modulus: number;
        poisson_ratio: number;
        height: number;
        weight: number;
        posture: string;
        visualization_type: string;
        grid_resolution: number;
        color_scheme: string;
        output_mode: 'image' | 'html' | 'both';
      } = {
        ...params,
        visualization_type:
          params.visualization_type || 'pressure_distribution',
        grid_resolution: params.grid_resolution || 50,
        color_scheme: params.color_scheme || 'viridis',
        output_mode: params.output_mode || 'html',
      };

      let plotConfig: { data: any[]; layout: any };

      // 根据可视化类型生成不同的图表
      switch (processedParams.visualization_type) {
        case 'pressure_distribution':
          plotConfig = this.generatePressureDistributionPlot(processedParams);
          break;
        case 'stress_analysis':
          plotConfig = this.generateStressAnalysisPlot(processedParams);
          break;
        case 'deformation':
          plotConfig = this.generateDeformationPlot(processedParams);
          break;
        default:
          plotConfig = this.generatePressureDistributionPlot(processedParams);
      }

      let imageUrl: string | undefined;
      let htmlUrl: string | undefined;

      // 生成交互式 HTML（当模式为 html 或 both 时）
      if (processedParams.output_mode === 'html' || processedParams.output_mode === 'both') {
        this.logger.log(`开始生成 HTML，模式: ${processedParams.output_mode}`);
        const interactiveFigure = {
          data: plotConfig.data,
          layout: plotConfig.layout,
          config: {
            displayModeBar: true,
            displaylogo: false,
            staticPlot: false,
            responsive: true,
          },
        };
        const htmlContent = this.generatePlotHTML(interactiveFigure);

        if (this.s3Enabled && this.s3Helpers) {
          try {
            const fileName = `plotly-${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 10)}.html`;
            const buffer = Buffer.from(htmlContent, 'utf8');
            const uploadedUrl = await this.s3Helpers.uploadFile(
              buffer,
              fileName,
              'text/html; charset=utf-8',
            );
            this.logger.log(`交互式 HTML 已上传到 S3: ${uploadedUrl}`);
            htmlUrl = uploadedUrl;
          } catch (uploadError) {
            this.logger.error(
              `上传交互式 HTML 到 S3 失败: ${uploadError.message}`,
            );
            const base64Html = Buffer.from(htmlContent).toString('base64');
            htmlUrl = `data:text/html;base64,${base64Html}`;
          }
        } else {
          const base64Html = Buffer.from(htmlContent).toString('base64');
          htmlUrl = `data:text/html;base64,${base64Html}`;
        }
        this.logger.log(`HTML 生成完成，htmlUrl: ${htmlUrl ? '已设置' : '未设置'}`);
      }

      // 生成静态图片（当模式为 image 或 both 时）
      if (processedParams.output_mode === 'image' || processedParams.output_mode === 'both') {
        this.logger.log(`开始生成图片，模式: ${processedParams.output_mode}`);
        try {
          imageUrl = await this.generatePlotImage(
            plotConfig.data,
            plotConfig.layout,
          );

          if (imageUrl) {
            this.logger.log(`图片生成完成，imageUrl: ${imageUrl ? '已设置' : '未设置'}`);
          } else {
            this.logger.warn('图片生成不可用（服务器环境不支持），仅返回 HTML');
            // 如果用户只要求 image 模式但失败了，自动降级到 html
            if (processedParams.output_mode === 'image' && !htmlUrl) {
              this.logger.log('自动降级到 HTML 模式');
              const interactiveFigure = {
                data: plotConfig.data,
                layout: plotConfig.layout,
                config: {
                  displayModeBar: true,
                  displaylogo: false,
                  staticPlot: false,
                  responsive: true,
                },
              };
              const htmlContent = this.generatePlotHTML(interactiveFigure);

              if (this.s3Enabled && this.s3Helpers) {
                try {
                  const fileName = `plotly-${Date.now()}-${Math.random()
                    .toString(36)
                    .substring(2, 10)}.html`;
                  const buffer = Buffer.from(htmlContent, 'utf8');
                  const uploadedUrl = await this.s3Helpers.uploadFile(
                    buffer,
                    fileName,
                    'text/html; charset=utf-8',
                  );
                  this.logger.log(`交互式 HTML 已上传到 S3: ${uploadedUrl}`);
                  htmlUrl = uploadedUrl;
                } catch (uploadError) {
                  this.logger.error(
                    `上传交互式 HTML 到 S3 失败: ${uploadError.message}`,
                  );
                  const base64Html = Buffer.from(htmlContent).toString('base64');
                  htmlUrl = `data:text/html;base64,${base64Html}`;
                }
              } else {
                const base64Html = Buffer.from(htmlContent).toString('base64');
                htmlUrl = `data:text/html;base64,${base64Html}`;
              }
            }
          }
        } catch (imageError) {
          this.logger.error(`图片生成失败: ${imageError.message}`);
          // 如果是 both 模式，图片生成失败不影响 HTML 返回
          if (processedParams.output_mode === 'image') {
            // 如果只要求图片模式，抛出错误
            throw imageError;
          }
          // both 模式下，图片失败不影响 HTML
          this.logger.warn('图片生成失败，但 HTML 已生成，继续返回 HTML');
        }
      }

      // 生成请求ID
      const requestId = Date.now().toString();

      // 调试日志
      this.logger.log(`最终返回值 - imageUrl: ${imageUrl ? '有值' : 'undefined'}, htmlUrl: ${htmlUrl ? '有值' : 'undefined'}`);

      // 返回结果（默认不返回 plot_data，如需调试可传入 debug=true）
      const baseResult: any = {
        requestId,
        status: 'completed',
        visualization_type: processedParams.visualization_type,
        image_url: imageUrl,
        html_url: htmlUrl,
        parameters: {
          youngs_modulus: processedParams.youngs_modulus,
          poisson_ratio: processedParams.poisson_ratio,
          height: processedParams.height,
          weight: processedParams.weight,
          posture: processedParams.posture,
          grid_resolution: processedParams.grid_resolution,
          color_scheme: processedParams.color_scheme,
          output_mode: processedParams.output_mode,
        },
      };

      if ((params as any)?.debug === true) {
        baseResult.plot_data = plotConfig;
      }

      return baseResult;
    } catch (error) {
      this.logger.error(`执行可视化失败: ${error.message}`);
      throw new Error(`执行可视化失败: ${error.message}`);
    }
  }
}
