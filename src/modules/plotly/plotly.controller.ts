import { Body, Controller, Post, UseGuards, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlotlyService } from './plotly.service';
import {
  MonkeyToolName,
  MonkeyToolDescription,
  MonkeyToolCategories,
  MonkeyToolInput,
  MonkeyToolOutput,
  MonkeyToolDisplayName,
  MonkeyToolIcon,
  MonkeyToolExtra,
} from '@/common/decorators/monkey-block-api-extensions.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
import { PlotlyRequestDto } from '@/common/schemas/plotly';

@ApiTags('Plotly 可视化')
@Controller('plotly')
@UseGuards(new AuthGuard())
export class PlotlyController {
  private readonly logger = new Logger(PlotlyController.name);

  constructor(private readonly plotlyService: PlotlyService) {}

  @Post('visualize')
  @MonkeyToolName('plotly_visualization')
  @MonkeyToolDisplayName({
    'zh-CN': 'Plotly 可视化',
    'en-US': 'Plotly Visualization',
  })
  @MonkeyToolDescription({
    'zh-CN': '基于杨氏模量、泊松比、身高、体重和坐姿进行压力分布可视化分析',
    'en-US':
      "Pressure distribution visualization analysis based on Young's modulus, Poisson's ratio, height, weight and posture",
  })
  @MonkeyToolCategories(['data-visualization', 'engineering-analysis'])
  @MonkeyToolIcon('emoji:📊:#FF6B6B')
  @MonkeyToolInput([
    {
      name: 'input',
      type: 'json',
      displayName: {
        'zh-CN': '输入参数',
        'en-US': 'Input Parameters',
      },
      description: {
        'zh-CN': '包含杨氏模量、泊松比、身高、体重、坐姿等参数的JSON对象',
        'en-US':
          "JSON object containing Young's modulus, Poisson's ratio, height, weight, posture and other parameters",
      },
      default: {
        youngs_modulus: 2e6,
        poisson_ratio: 0.3,
        height: 175,
        weight: 70,
        posture: 'sitting',
        visualization_type: 'pressure_distribution',
        grid_resolution: 50,
        color_scheme: 'viridis',
        output_mode: 'html',
      },
      required: true,
    },
  ])
  @MonkeyToolOutput([
    {
      name: 'code',
      displayName: {
        'zh-CN': '状态码',
        'en-US': 'Status Code',
      },
      type: 'number',
      description: {
        'zh-CN': '200 表示成功，其他表示失败',
        'en-US': '200 means success, other means failure',
      },
    },
    {
      name: 'requestId',
      displayName: {
        'zh-CN': '请求ID',
        'en-US': 'Request ID',
      },
      type: 'string',
      description: {
        'zh-CN': '唯一请求标识符',
        'en-US': 'Unique request identifier',
      },
    },
    {
      name: 'status',
      displayName: {
        'zh-CN': '状态',
        'en-US': 'Status',
      },
      type: 'string',
      description: {
        'zh-CN': '请求处理状态',
        'en-US': 'Request processing status',
      },
    },
    {
      name: 'visualization_type',
      displayName: {
        'zh-CN': '可视化类型',
        'en-US': 'Visualization Type',
      },
      type: 'string',
      description: {
        'zh-CN': '生成的可视化类型（压力分布、应力分析、变形分析）',
        'en-US':
          'Type of visualization generated (pressure distribution, stress analysis, deformation)',
      },
    },
    {
      name: 'image_url',
      displayName: {
        'zh-CN': '图像URL',
        'en-US': 'Image URL',
      },
      type: 'string',
      description: {
        'zh-CN': '生成的可视化图像URL或base64数据',
        'en-US': 'URL or base64 data of the generated visualization image',
      },
    },
    {
      name: 'html_url',
      displayName: {
        'zh-CN': '交互式HTML URL',
        'en-US': 'Interactive HTML URL',
      },
      type: 'string',
      description: {
        'zh-CN': '当 output_mode=html 时返回：S3 链接或 data URL',
        'en-US': 'Returned when output_mode=html: S3 link or data URL',
      },
    },
    {
      name: 'parameters',
      displayName: {
        'zh-CN': '参数信息',
        'en-US': 'Parameters',
      },
      type: 'json',
      description: {
        'zh-CN': '使用的输入参数',
        'en-US': 'Input parameters used',
      },
    },
    // 不再对外返回大体积的 plot_data
  ])
  @MonkeyToolExtra({
    estimateTime: 5000,
  })
  public async visualize(@Body() body: PlotlyRequestDto) {
    try {
      // 处理输入参数
      let processedBody: any = { ...body };

      // 如果存在 input 字段，将其内容提取到顶层
      if (body.input && typeof body.input === 'object') {
        const { input, ...restBody } = body;
        processedBody = { ...restBody, ...input };
        this.logger.log(
          '处理 input 对象后的请求体：',
          JSON.stringify(processedBody, null, 2),
        );
      }

      // 验证必需参数
      const requiredParams = [
        'youngs_modulus',
        'poisson_ratio',
        'height',
        'weight',
        'posture',
      ];
      for (const param of requiredParams) {
        if (
          processedBody[param] === undefined ||
          processedBody[param] === null
        ) {
          throw new Error(`缺少必需参数: ${param}`);
        }
      }

      const result =
        await this.plotlyService.executeVisualization(processedBody);

      return {
        code: 200,
        ...result,
      };
    } catch (error) {
      this.logger.error(`可视化请求失败: ${error.message}`);
      return {
        code: 500,
        error: error.message,
        requestId: Date.now().toString(),
        status: 'failed',
      };
    }
  }
}
