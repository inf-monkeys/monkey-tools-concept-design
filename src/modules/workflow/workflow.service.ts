import { config } from '@/common/config';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

export interface RequestWorkflowParams {
  workflowId: string;
  inputData: any;
  timeout?: number;
  baseUrl?: string;
  apiKey?: string;
}

@Injectable()
export class WorkflowService {
  constructor(
  ) {}

  public async requestWorkflow({
    workflowId,
    inputData,
    timeout = config.workflow.timeout,
    baseUrl = config.workflow.baseUrl,
    apiKey = config.workflow.apiKey,
  }) {
    try {
      const requestUrl = new URL(`/api/workflow/executions/${workflowId}/start-sync`, baseUrl)
      const resp = await axios.post(requestUrl.href, {
        inputData,
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        timeout: timeout * 1000
      });
      return resp.data
    } catch (error) {
      throw error;
    }
  }
}
