import { MonkeyToolCategories, MonkeyToolDescription, MonkeyToolDisplayName, MonkeyToolIcon, MonkeyToolInput, MonkeyToolName, MonkeyToolOutput } from '@/common/decorators/monkey-block-api-extensions.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ConceptDesignService } from './concept-design.service';

@Controller('concept-design')
@UseGuards(new AuthGuard())
@ApiTags('Concept Design')
export class ConceptDesignController {
  constructor(private readonly service: ConceptDesignService) {}

  @Post('model')
  @ApiOperation({ summary: '参数化建模', description: '根据 name/modelid/params 进行参数化建模，输出 x_t 文件（后续可转换为 SLDPRT）' })
  @MonkeyToolName('model')
  @MonkeyToolCategories(['concept-design', 'cad'])
  @MonkeyToolIcon('lucide:box')
  @MonkeyToolDisplayName({ 'zh-CN': '参数化建模', 'en-US': 'Parametric Modeling' })
  @MonkeyToolDescription({ 'zh-CN': '输入模型名称/编号与参数，生成 x_t 模型文件', 'en-US': 'Generate x_t model by name/modelid/params' })
  @MonkeyToolInput([
    { name: 'name', displayName: { 'zh-CN': '名称', 'en-US': 'Name' }, type: 'string', required: true, placeholder: 'landingGear' },
    { name: 'it', displayName: { 'zh-CN': '迭代轮次', 'en-US': 'Iteration' }, type: 'number', required: true, default: 0 },
    { name: 'modelid', displayName: { 'zh-CN': '模型编号', 'en-US': 'Model ID' }, type: 'number', required: true, default: 1 },
    // 使用 json 类型，确保工作流界面以对象方式采集并传递，而不是字符串
    { name: 'params', displayName: { 'zh-CN': '参数(JSON 或对象)', 'en-US': 'Params (JSON/Object)' }, type: 'json', required: true, default: {} },
  ])
  @MonkeyToolOutput([
    { name: 'status', displayName: { 'zh-CN': '状态', 'en-US': 'Status' }, type: 'string' },
    { name: 'message', displayName: { 'zh-CN': '信息', 'en-US': 'Message' }, type: 'string' },
    { name: 'output_directory', displayName: { 'zh-CN': '输出目录', 'en-US': 'Output Directory' }, type: 'string' },
  ])
  public async model(@Body() body: any) {
    // 兼容两种入参格式：
    // 1) { inputs: { it, name, modelid, params }, credential }
    // 2) { it, name, modelid, params }
    const inputs = body?.inputs ?? body ?? {};
    const credential = body?.credential;
    return await this.service.model(inputs, credential);
  }

  @Post('transform')
  @ApiOperation({ summary: '转换为 SLDPRT', description: '将 name+it 的 x_t 转换为 SLDPRT' })
  @MonkeyToolName('transform')
  @MonkeyToolCategories(['concept-design', 'cad'])
  @MonkeyToolIcon('lucide:scan')
  @MonkeyToolDisplayName({ 'zh-CN': '转换为 SLDPRT', 'en-US': 'Transform to SLDPRT' })
  @MonkeyToolInput([
    { name: 'name', displayName: { 'zh-CN': '名称', 'en-US': 'Name' }, type: 'string', required: true },
    { name: 'it', displayName: { 'zh-CN': '迭代轮次', 'en-US': 'Iteration' }, type: 'number', required: true, default: 0 },
  ])
  @MonkeyToolOutput([
    { name: 'status', displayName: { 'zh-CN': '状态', 'en-US': 'Status' }, type: 'string' },
    { name: 'message', displayName: { 'zh-CN': '信息', 'en-US': 'Message' }, type: 'string' },
  ])
  public async transform(@Body() body: any) {
    const inputs = body?.inputs ?? body ?? {};
    const credential = body?.credential;
    return await this.service.transform(inputs, credential);
  }

  @Post('analyze')
  @ApiOperation({ summary: '有限元分析', description: '对指定 SLDPRT 模型进行有限元分析' })
  @MonkeyToolName('analyze')
  @MonkeyToolCategories(['concept-design', 'fea'])
  @MonkeyToolIcon('lucide:activity')
  @MonkeyToolDisplayName({ 'zh-CN': '有限元分析', 'en-US': 'FEA Analyze' })
  @MonkeyToolInput([
    { name: 'filename', displayName: { 'zh-CN': '名称(=name)', 'en-US': 'Filename (=name)' }, type: 'string', required: true },
    { name: 'it', displayName: { 'zh-CN': '迭代轮次', 'en-US': 'Iteration' }, type: 'number', required: true, default: 0 },
    { name: 'force', displayName: { 'zh-CN': '力值(N)', 'en-US': 'Force (N)' }, type: 'number', required: true, default: 150 },
    { name: 'm_n', displayName: { 'zh-CN': '材料', 'en-US': 'Material' }, type: 'string', required: true, default: '合金钢' },
  ])
  @MonkeyToolOutput([
    { name: 'status', displayName: { 'zh-CN': '状态', 'en-US': 'Status' }, type: 'string' },
    { name: 'message', displayName: { 'zh-CN': '信息', 'en-US': 'Message' }, type: 'string' },
    { name: 'data', displayName: { 'zh-CN': '结果', 'en-US': 'Result' }, type: 'string' },
  ])
  public async analyze(@Body() body: any) {
    const inputs = body?.inputs ?? body ?? {};
    const credential = body?.credential;
    return await this.service.analyze(inputs, credential);
  }

  @Post('get-image')
  @ApiOperation({ summary: '获取分析结果图像', description: '获取有限元分析生成的图像文件' })
  // 工具标识避免连字符，防止部分平台解析失败
  @MonkeyToolName('get_image')
  @MonkeyToolCategories(['concept-design', 'visualization'])
  @MonkeyToolIcon('lucide:image')
  @MonkeyToolDisplayName({ 'zh-CN': '获取结果图像', 'en-US': 'Get Result Image' })
  @MonkeyToolDescription({ 'zh-CN': '获取有限元分析生成的图像文件', 'en-US': 'Get FEA result images' })
  @MonkeyToolInput([
    { name: 'name', displayName: { 'zh-CN': '名称', 'en-US': 'Name' }, type: 'string', required: true, placeholder: 'landingGear' },
    { name: 'it', displayName: { 'zh-CN': '迭代轮次', 'en-US': 'Iteration' }, type: 'number', required: true, default: 0 },
    { name: 'imageType', displayName: { 'zh-CN': '图像类型', 'en-US': 'Image Type' }, type: 'string', required: true, default: 'final' },
  ])
  @MonkeyToolOutput([
    { name: 'status', displayName: { 'zh-CN': '状态', 'en-US': 'Status' }, type: 'string' },
    { name: 'message', displayName: { 'zh-CN': '信息', 'en-US': 'Message' }, type: 'string' },
    { name: 'imageUrl', displayName: { 'zh-CN': '图像链接', 'en-US': 'Image URL' }, type: 'string' },
  ])
  public async getImageTool(@Body() body: any) {
    const inputs = body?.inputs ?? body ?? {};
    const { name, it, imageType } = inputs;

    // 尝试多种图像文件名格式
    const possibleNames = [
      `${imageType}.jpg`,                    // final.jpg
      `${name}${it}_${imageType}.jpg`,       // landingGear0_final.jpg
      `${name}_${imageType}.jpg`,            // landingGear_final.jpg
      `${name}${it}.jpg`,                    // landingGear0.jpg
      `${imageType}_${name}${it}.jpg`,       // final_landingGear0.jpg
    ];

    for (const imageName of possibleNames) {
      try {
        // 验证图像是否存在
        await this.service.getImage(imageName);

        // 返回图像链接
        const imageUrl = `/concept-design/results/${imageName}`;

        return {
          status: 'success',
          message: `成功获取 ${imageType} 图像`,
          imageUrl: imageUrl
        };
      } catch (error) {
        // 继续尝试下一个文件名格式
        continue;
      }
    }

    // 所有格式都失败
    return {
      status: 'error',
      message: `未找到 ${imageType} 图像文件。尝试的文件名：${possibleNames.join(', ')}`,
      imageUrl: null
    };
  }

  @Get('results/:imageName')
  @ApiOperation({ summary: '获取分析结果图像', description: '获取有限元分析生成的图像文件' })
  public async getImage(@Param('imageName') imageName: string, @Res() res: Response) {
    try {
      const imageResponse = await this.service.getImage(imageName);

      // 设置响应头
      res.setHeader('Content-Type', imageResponse.headers['content-type'] || 'image/jpeg');
      res.setHeader('Content-Length', imageResponse.headers['content-length'] || '');

      // 将图像流管道到响应
      imageResponse.data.pipe(res);
    } catch (error) {
      res.status(404).json({
        error: '图像未找到',
        message: `无法获取图像: ${imageName}`,
        details: error.message
      });
    }
  }
}
