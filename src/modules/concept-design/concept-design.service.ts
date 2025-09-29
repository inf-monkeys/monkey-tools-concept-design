import { config } from '@/common/config';
import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable()
export class ConceptDesignService {
  private readonly logger = new Logger(ConceptDesignService.name);

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
    };
    this.logger.debug(`POST ${url}`);
    const resp = await axios<T>(options);
    return resp.data as T;
  }

  public async model(inputs: { it: any; name: string; modelid: any; params: any; [k: string]: any }, credential?: any) {
    // 清洗 & 规范化入参：去除工作流附带的内部字段、强转数值、解析 JSON 字符串
    const { __advancedConfig, ...rest } = inputs || {};
    const clean: any = { ...rest };

    // 强转 it 和 modelid 为 number
    if (typeof clean.it === 'string') clean.it = Number(clean.it);
    if (typeof clean.modelid === 'string') clean.modelid = Number(clean.modelid);

    // 如果 params 是字符串，尽力解析为对象
    if (typeof clean?.params === 'string') {
      const raw = clean.params.trim();
      try {
        clean.params = JSON.parse(raw);
      } catch (e) {
        // 尝试常见修复：单引号转双引号，移除对象/数组末尾多余逗号
        try {
          const repaired = raw.replace(/'/g, '"').replace(/,(?=\s*[}\]])/g, '');
          clean.params = JSON.parse(repaired);
        } catch (e2) {
          this.logger.warn(`params looks like string but is not valid JSON, forwarding as-is`);
        }
      }
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

  public async transform(inputs: { it: any; name: string; [k: string]: any }, credential?: any) {
    const { __advancedConfig, ...rest } = inputs || {};
    const clean: any = { ...rest };
    if (typeof clean.it === 'string') clean.it = Number(clean.it);
    const payload = { it: clean.it, name: clean.name };
    this.logger.debug(`Forwarding payload to /api/v1/transform: ${JSON.stringify(payload)}`);
    return await this.post('/api/v1/transform', payload, credential);
  }

  public async analyze(inputs: { it: any; filename: string; force: any; m_n: string; [k: string]: any }, credential?: any) {
    const { __advancedConfig, ...rest } = inputs || {};
    const clean: any = { ...rest };
    if (typeof clean.it === 'string') clean.it = Number(clean.it);
    if (typeof clean.force === 'string') clean.force = Number(clean.force);
    const payload = { it: clean.it, filename: clean.filename, force: clean.force, m_n: clean.m_n };
    this.logger.debug(`Forwarding payload to /api/v1/analyze: ${JSON.stringify(payload)}`);
    return await this.post('/api/v1/analyze', payload, credential);
  }
}
