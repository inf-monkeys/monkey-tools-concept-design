import { MonkeyToolCategories, MonkeyToolDescription, MonkeyToolDisplayName, MonkeyToolIcon, MonkeyToolInput, MonkeyToolName, MonkeyToolOutput } from '@/common/decorators/monkey-block-api-extensions.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { config } from '@/common/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { ConceptDesignService } from './concept-design.service';
import { getDefaultParams } from './initial-params';

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
    { name: 'modelid', displayName: { 'zh-CN': '模型编号', 'en-US': 'Model ID' }, type: 'number', required: true, default: 1, description: { 'zh-CN': '0=双滑撬, 1=多足, 2=连杆', 'en-US': '0=Double Skid, 1=Multi-leg, 2=Linkage' } },
    // 使用 json 类型，确保工作流界面以对象方式采集并传递，而不是字符串；如果不传则自动使用默认参数
    { name: 'params', displayName: { 'zh-CN': '参数(JSON 或对象)', 'en-US': 'Params (JSON/Object)' }, type: 'json', required: false, default: null, description: { 'zh-CN': '可选，不填则使用默认参数', 'en-US': 'Optional, use default if not provided' } },
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

    // 如果没有传 params 或 params 为空，使用默认参数
    if (!inputs.params || (typeof inputs.params === 'object' && Object.keys(inputs.params).length === 0)) {
      inputs.params = getDefaultParams(inputs.modelid ?? 1);
    }

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
    { name: 'modelid', displayName: { 'zh-CN': '模型编号', 'en-US': 'Model ID' }, type: 'number', required: false, default: 0, description: { 'zh-CN': '0=双滑撬, 1=多足, 2=连杆', 'en-US': '0=Double Skid, 1=Multi-leg, 2=Linkage' } },
    { name: 'force', displayName: { 'zh-CN': '力值(N)', 'en-US': 'Force (N)' }, type: 'number', required: true, default: 150 },
    { name: 'm_n', displayName: { 'zh-CN': '材料', 'en-US': 'Material' }, type: 'string', required: true, default: '合金钢' },
    { name: 'params', displayName: { 'zh-CN': '参数(JSON 或对象)', 'en-US': 'Params (JSON/Object)' }, type: 'json', required: false, default: null, description: { 'zh-CN': '可选，不填则使用默认参数', 'en-US': 'Optional, use default if not provided' } },
  ])
  @MonkeyToolOutput([
    { name: 'status', displayName: { 'zh-CN': '状态', 'en-US': 'Status' }, type: 'string' },
    { name: 'message', displayName: { 'zh-CN': '信息', 'en-US': 'Message' }, type: 'string' },
    { name: 'data', displayName: { 'zh-CN': '结果', 'en-US': 'Result' }, type: 'string' },
  ])
  public async analyze(@Body() body: any) {
    const inputs = body?.inputs ?? body ?? {};
    const credential = body?.credential;

    // 如果没有传 params 或 params 为空，使用默认参数
    if (!inputs.params || (typeof inputs.params === 'object' && Object.keys(inputs.params).length === 0)) {
      inputs.params = getDefaultParams(inputs.modelid ?? 0);
    }

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
    { name: 'modelid', displayName: { 'zh-CN': '模型编号', 'en-US': 'Model ID' }, type: 'number', required: false, default: 0 },
    { name: 'imageType', displayName: { 'zh-CN': '图像类型', 'en-US': 'Image Type' }, type: 'string', required: true, default: 'final' },
  ])
  @MonkeyToolOutput([
    { name: 'status', displayName: { 'zh-CN': '状态', 'en-US': 'Status' }, type: 'string' },
    { name: 'message', displayName: { 'zh-CN': '信息', 'en-US': 'Message' }, type: 'string' },
    { name: 'imageUrl', displayName: { 'zh-CN': '图像链接', 'en-US': 'Image URL' }, type: 'string' },
    { name: 'imageName', displayName: { 'zh-CN': '文件名', 'en-US': 'Image Name' }, type: 'string' },
  ])
  public async getImageTool(@Body() body: any, @Req() req: Request) {
    const inputs = body?.inputs ?? body ?? {};
    const { name, it, imageType, modelid } = inputs;

    // 构建唯一图像名称：name_it_modelid_imageType.jpg
    const uniqueImageName = `${name}${it}_${modelid ?? 0}_${imageType}.jpg`;

    // 尝试多种图像文件名格式（优先尝试新格式，然后回退到旧格式）
    const possibleNames = [
      uniqueImageName,                       // model_demo0_2_final.jpg (新格式，唯一)
      `${imageType}.jpg`,                    // final.jpg (旧格式，会被覆盖)
      `${name}${it}_${imageType}.jpg`,       // model_demo0_final.jpg
      `${name}_${imageType}.jpg`,            // model_demo_final.jpg
      `${name}${it}.jpg`,                    // model_demo0.jpg
      `${imageType}_${name}${it}.jpg`,       // final_model_demo0.jpg
    ];

    for (const imageName of possibleNames) {
      try {
        // 优先上传 S3 并得到可访问 URL，失败回退为代理直链
        const { url, source } = await this.service.fetchImageUrl(imageName);

        // 统一输出的 imageUrl：S3 URL 直接使用，代理直链拼成绝对地址
        let imageUrl = url;
        if (source === 'upstream') {
          // 优先使用配置的 appUrl
          const base = config.server?.appUrl;
          if (base && base !== `http://localhost:${config.server?.port || 3000}`) {
            // 配置了有效的 appUrl（非默认 localhost）
            imageUrl = `${base.replace(/\/$/, '')}${url}`;
          } else {
            // 尝试从请求头推断
            const protocol = req.secure || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
            const host = req.get('x-forwarded-host') || req.get('host');
            if (host && !host.includes('localhost')) {
              imageUrl = `${protocol}://${host}${url}`;
            } else {
              // 如果实在无法获取，返回相对路径（由前端或网关处理）
              imageUrl = url;
            }
          }
        }

        return {
          status: 'success',
          message: `成功获取 ${imageType} 图像`,
          imageUrl,
          imageName: imageName,
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
