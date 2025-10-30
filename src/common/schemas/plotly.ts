import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

// 定义坐姿枚举
const PostureEnum = z.enum(
  ['sitting', 'standing', 'lying', 'walking', 'running', 'right', 'left', 'center'],
  {
    message: '坐姿必须是有效的姿势类型',
  },
);

// 定义 Plotly 可视化参数模式
export const PlotlyParamsSchema = z
  .object({
    // 杨氏模量 (Pa)
    youngs_modulus: z
      .number({
        message: '杨氏模量必须是数字',
      })
      .min(1e3, '杨氏模量必须大于 1000 Pa')
      .max(1e12, '杨氏模量不能超过 1e12 Pa')
      .describe('杨氏模量，单位：Pa'),

    // 泊松比
    poisson_ratio: z
      .number({
        message: '泊松比必须是数字',
      })
      .min(0, '泊松比不能小于 0')
      .max(0.5, '泊松比不能大于 0.5')
      .describe('泊松比，范围：0-0.5'),

    // 身高 (cm)
    height: z
      .number({
        message: '身高必须是数字',
      })
      .min(100, '身高不能小于 100 cm')
      .max(250, '身高不能大于 250 cm')
      .describe('身高，单位：cm'),

    // 体重 (kg)
    weight: z
      .number({
        message: '体重必须是数字',
      })
      .min(20, '体重不能小于 20 kg')
      .max(300, '体重不能大于 300 kg')
      .describe('体重，单位：kg'),

    // 坐姿
    posture: PostureEnum.describe('坐姿类型'),

    // 可选参数：可视化类型
    visualization_type: z
      .enum(['pressure_distribution', 'stress_analysis', 'deformation'])
      .optional()
      .default('pressure_distribution')
      .describe('可视化类型：压力分布、应力分析、变形分析'),

    // 可选参数：网格分辨率
    grid_resolution: z
      .number()
      .int()
      .min(10, '网格分辨率不能小于 10')
      .max(100, '网格分辨率不能大于 100')
      .optional()
      .default(50)
      .describe('网格分辨率，影响计算精度'),

    // 可选参数：颜色方案
    color_scheme: z
      .enum(['viridis', 'plasma', 'inferno', 'magma', 'jet', 'hot', 'cool'])
      .optional()
      .default('viridis')
      .describe('颜色方案'),

    // 输出模式：image（静态图片）或 html（交互式页面）或 both（同时输出）
    output_mode: z
      .enum(['image', 'html', 'both'])
      .optional()
      .default('html')
      .describe('输出模式：html（默认，仅返回交互式HTML链接），both（同时返回图片和HTML），image（仅返回图片/base64）'),
  })
  .passthrough();

// 创建 DTO 类 - 直接使用 PlotlyParamsSchema 避免循环依赖
// Controller 中保留对 input 字段的兼容处理
export class PlotlyRequestDto extends createZodDto(PlotlyParamsSchema) {}
