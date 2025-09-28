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

  public async model(inputs: { it: number; name: string; modelid: number; params: any }, credential?: any) {
    // If params is a string, try parse it as JSON
    if (typeof inputs?.params === 'string') {
      try {
        inputs = { ...inputs, params: JSON.parse(inputs.params) };
      } catch (e) {
        this.logger.warn(`params is string but not valid JSON, send as-is`);
      }
    }
    return await this.post('/api/v1/model', inputs, credential);
  }

  public async transform(inputs: { it: number; name: string }, credential?: any) {
    return await this.post('/api/v1/transform', inputs, credential);
  }

  public async analyze(inputs: { it: number; filename: string; force: number; m_n: string }, credential?: any) {
    return await this.post('/api/v1/analyze', inputs, credential);
  }
}

