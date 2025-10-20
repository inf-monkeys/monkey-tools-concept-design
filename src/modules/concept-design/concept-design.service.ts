import { config } from '@/common/config';
import { S3Helpers } from '@/common/s3';
import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable()
export class ConceptDesignService {
  private readonly logger = new Logger(ConceptDesignService.name);
  private s3Helpers: S3Helpers | null = null;
  private s3Enabled: boolean = false;

  constructor() {
    // 只有在 S3 配置存在时才初始化 S3Helpers
    if (config.s3 && config.s3.bucket && config.s3.accessKeyId && config.s3.secretAccessKey) {
      try {
        this.s3Helpers = new S3Helpers();
        this.s3Enabled = true;
        this.logger.log('S3 存储已启用');
      } catch (error) {
        this.logger.error(`初始化 S3Helpers 失败: ${error.message}`);
        this.s3Enabled = false;
      }
    } else {
      this.logger.warn('S3 配置不完整，图像将直接返回流数据');
      this.s3Enabled = false;
    }
  }

  private getBaseUrl() {
    const base = (config as any)?.conceptDesign?.baseUrl || process.env.CONCEPT_DESIGN_BASE_URL;
    if (!base) {
      throw new Error('ConceptDesign baseUrl is not configured. Set conceptDesign.baseUrl or CONCEPT_DESIGN_BASE_URL');
    }
    return base.replace(/\/$/, '');
  }

  private getTimeoutMs() {
    const seconds = (config as any)?.conceptDesign?.timeout ?? 900; // default 900s
    return Number(seconds) * 1000;
  }

  private buildHeaders(credential?: { api_key?: string; encryptedData?: string; type?: string }) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    // Priority: credential.api_key -> credential.encryptedData -> config.conceptDesign.bearer
    const bearer = credential?.api_key || credential?.encryptedData || (config as any)?.conceptDesign?.bearer || process.env.CONCEPT_DESIGN_BEARER;
    if (bearer) {
      headers['Authorization'] = `Bearer ${bearer}`;
    }
    return headers;
  }

  private async post<T = any>(path: string, data: any, credential?: any) {
    const base = this.getBaseUrl();
    const url = `${base}${path}`;
    const options: AxiosRequestConfig = {
      method: 'POST',
      url,
      data,
      headers: this.buildHeaders(credential),
      timeout: this.getTimeoutMs(),
      // 强制使用 IPv4，避免 Docker 容器中 IPv6 解析问题
      family: 4,
    };
    this.logger.debug(`POST ${url}`);
    const resp = await axios<T>(options);
    return resp.data as T;
  }

  public async model(inputs: { it: any; name: string; modelid: any; params: any;[k: string]: any }, credential?: any) {
    // 清洗 & 规范化入参：去除工作流附带的内部字段、强转数值、解析 JSON 字符串
    this.logger.debug(`Original inputs before processing: ${JSON.stringify(inputs)}`);

    const { __advancedConfig, ...rest } = (inputs || {}) as any;
    const clean: any = { ...rest };

    this.logger.debug(`After removing __advancedConfig: ${JSON.stringify(clean)}`);
    this.logger.debug(`Type of clean.it: ${typeof clean.it}, Value: ${clean.it}`);

    // 强转 it 和 modelid 为 number
    if (typeof clean.it === 'string') clean.it = Number(clean.it);
    if (typeof clean.modelid === 'string') clean.modelid = Number(clean.modelid);

    // 如果 params 是字符串，尽力解析为对象
    if (typeof clean?.params === 'string') {
      const raw = clean.params.trim();
      try {
        clean.params = JSON.parse(raw);
        this.logger.debug(`Successfully parsed params string to object: ${JSON.stringify(clean.params)}`);
      } catch (e) {
        // 尝试常见修复：单引号转双引号，移除对象/数组末尾多余逗号
        try {
          const repaired = raw.replace(/'/g, '"').replace(/,(?=\s*[}\]])/g, '');
          clean.params = JSON.parse(repaired);
          this.logger.debug(`Successfully parsed repaired params string to object: ${JSON.stringify(clean.params)}`);
        } catch (e2) {
          this.logger.error(`Failed to parse params as JSON: ${raw}. Error: ${e2.message}`);
          throw new Error(`Invalid params format: ${raw}`);
        }
      }
    }

    // 验证必需参数
    if (clean.it === undefined || clean.it === null) {
      throw new Error(`Missing required parameter 'it': ${clean.it}`);
    }
    if (!clean.name) {
      throw new Error(`Missing required parameter 'name': ${clean.name}`);
    }
    if (clean.modelid === undefined || clean.modelid === null) {
      throw new Error(`Missing required parameter 'modelid': ${clean.modelid}`);
    }
    if (!clean.params) {
      throw new Error(`Missing required parameter 'params': ${clean.params}`);
    }

    // 仅转发必要字段，避免上游对未知字段敏感
    const payload = {
      it: clean.it,
      name: clean.name,
      modelid: clean.modelid,
      params: clean.params,
    };

    this.logger.debug(`Forwarding payload to /api/v1/model: ${JSON.stringify(payload)}`);
    return await this.post('/api/v1/model', payload, credential);
  }

  public async transform(inputs: { it: any; name: string;[k: string]: any }, credential?: any) {
    const { __advancedConfig, ...rest } = (inputs || {}) as any;
    const clean: any = { ...rest };
    if (typeof clean.it === 'string') clean.it = Number(clean.it);
    const payload = { it: clean.it, name: clean.name };
    this.logger.debug(`Forwarding payload to /api/v1/transform: ${JSON.stringify(payload)}`);
    return await this.post('/api/v1/transform', payload, credential);
  }

  public async analyze(inputs: { it: any; filename: string; force: any; m_n: string; modelid?: any;[k: string]: any }, credential?: any) {
    const { __advancedConfig, ...rest } = (inputs || {}) as any;
    const clean: any = { ...rest };
    if (typeof clean.it === 'string') clean.it = Number(clean.it);
    if (typeof clean.force === 'string') clean.force = Number(clean.force);
    if (clean.modelid !== undefined && typeof clean.modelid === 'string') clean.modelid = Number(clean.modelid);

    // 构建 payload，将 modelid 映射为后端的 id 参数
    const payload: any = {
      it: clean.it,
      filename: clean.filename,
      force: clean.force,
      m_n: clean.m_n,
    };

    // 如果有 modelid，将其作为 id 传递给后端
    if (clean.modelid !== undefined) {
      payload.id = clean.modelid;
    }

    this.logger.debug(`Forwarding payload to /api/v1/analyze: ${JSON.stringify(payload)}`);
    return await this.post('/api/v1/analyze', payload, credential);
  }

  public async getImage(imageName: string, credential?: any) {
    const base = this.getBaseUrl();
    const url = `${base}/api/v1/results/${imageName}`;
    const options: AxiosRequestConfig = {
      method: 'GET',
      url,
      headers: this.buildHeaders(credential),
      timeout: this.getTimeoutMs(),
      responseType: 'stream',
      // 强制使用 IPv4，避免 Docker 容器中 IPv6 解析问题
      family: 4,
    };
    this.logger.debug(`GET ${url}`);
    const resp = await axios(options);
    return resp;
  }

  /**
   * 获取图像并上传到 S3，返回 S3 URL；失败则抛错以便上层回退
   */
  public async getImageAndUploadToS3(imageName: string, credential?: any): Promise<string> {
    if (!this.s3Enabled || !this.s3Helpers) {
      throw new Error('S3 未启用，无法上传图像');
    }

    try {
      // 获取图像流
      const imageResponse = await this.getImage(imageName, credential);

      // 内容类型
      const contentType = imageResponse.headers['content-type'] || 'image/jpeg';

      // 使用稳定的 Key，便于覆盖同名文件
      const s3Key = `concept-design/results/${imageName}`;

      // 将流转换为 Buffer（解决 AWS SDK content-length 问题）
      const chunks: Buffer[] = [];
      for await (const chunk of imageResponse.data) {
        chunks.push(Buffer.from(chunk));
      }
      const buffer = Buffer.concat(chunks);

      // 上传到 S3
      const s3Url = await this.s3Helpers.uploadFile(
        buffer,
        s3Key,
        contentType,
      );

      this.logger.log(`图像已上传到 S3: ${s3Url}`);
      return s3Url;
    } catch (error: any) {
      this.logger.error(`上传图像到 S3 失败: ${error?.message}`);
      throw new Error(`上传图像到 S3 失败: ${error?.message}`);
    }
  }

  /**
   * 拉取图像并返回可访问的 URL。优先 S3，失败回退代理直链。
   */
  public async fetchImageUrl(imageName: string, credential?: any): Promise<{ url: string; source: 's3' | 'upstream' }>{
    if (this.s3Enabled && this.s3Helpers) {
      try {
        const url = await this.getImageAndUploadToS3(imageName, credential);
        return { url, source: 's3' };
      } catch (e) {
        this.logger.warn(`S3 上传失败，回退直链: ${(e as any)?.message}`);
      }
    }
    return { url: `/concept-design/results/${imageName}`, source: 'upstream' };
  }
}
