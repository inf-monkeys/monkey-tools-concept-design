import {
  MonkeyToolCategories,
  MonkeyToolDisplayName,
  MonkeyToolIcon,
  MonkeyToolInput,
  MonkeyToolName,
  MonkeyToolOutput
} from '@/common/decorators/monkey-block-api-extensions.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { WorkflowService } from './workflow.service';

@Controller('workflow/feature')
@UseGuards(new AuthGuard())
export class WorkflowFeatureController {
  constructor(private readonly service: WorkflowService) { }

  @Post('prompt_generation_text_to_image')
  @MonkeyToolName('prompt_generation_text_to_image')
  @MonkeyToolCategories(['feature', 'prototype'])
  @MonkeyToolIcon('lucide:image')
  @MonkeyToolDisplayName({
    "en-US": "Prompt Generation (Text_to_Image)",
    "zh-CN": "提示词生成（文生图）"
  })
  @MonkeyToolInput([
    {
      "name": "zzfbgh",
      "displayName": {
        "zh-CN": "设计需求"
      },
      "type": "string"
    }
  ])
  @MonkeyToolOutput([
    {
      name: 'data',
      displayName: {
        'zh-CN': '结果',
        'en-US': 'Result',
      },
      required: true,
      type: 'string',
    },
  ])
  public async promptGenerationTextToImage(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54a6cd8fa7d683a781f4a',
      inputData: body,
    });
  }

  @Post('design_content_evaluation')
  @MonkeyToolName('design_content_evaluation')
  @MonkeyToolCategories(['feature', 'logic', 'prototype'])
  @MonkeyToolIcon('lucide:brush')
  @MonkeyToolDisplayName({
    "en-US": "Design Content Evaluation",
    "zh-CN": "设计内容评价"
  })
  @MonkeyToolInput([
    {
      "name": "8wnpp6",
      "description": "",
      "displayName": {
        "zh-CN": "上传图像"
      },
      "required": false,
      "type": "file"
    },
    {
      "name": "98mmpj",
      "description": "",
      "displayName": {
        "zh-CN": "用户输入"
      },
      "required": false,
      "type": "string"
    }
  ])
  @MonkeyToolOutput([
    {
      name: 'data',
      displayName: {
        'zh-CN': '结果',
        'en-US': 'Result',
      },
      required: true,
      type: 'string',
    },
  ])
  public async designContentEvaluation(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54a8302ded7d03cbdf4a3',
      inputData: body,
    });
  }

  @Post('concept_visualization_3d_model_generation')
  @MonkeyToolName('concept_visualization_3d_model_generation')
  @MonkeyToolCategories(['feature', 'prototype'])
  @MonkeyToolIcon('lucide:box')
  @MonkeyToolDisplayName({
    "en-US": "Concept Visualization (3D Model Generation)",
    "zh-CN": "概念立体化(3D模型生成)"
  })
  @MonkeyToolInput([
    {
      "name": "image",
      "description": "",
      "displayName": {
        "en-US": "image upload",
        "zh-CN": "图片上传"
      },
      "required": false,
      "type": "file"
    }
  ])
  @MonkeyToolOutput([
    {
      name: 'data',
      displayName: {
        'zh-CN': '结果',
        'en-US': 'Result',
      },
      required: true,
      type: 'string',
    },
  ])
  public async conceptVisualization3dModelGeneration(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54ab7d712d3902fed5711',
      inputData: body,
    });
  }

  @Post('visual_storytelling_video_generation')
  @MonkeyToolName('visual_storytelling_video_generation')
  @MonkeyToolCategories(['feature', 'prototype'])
  @MonkeyToolIcon('lucide:file_video')
  @MonkeyToolDisplayName({
    "en-US": "Visual Storytelling (Video Generation)",
    "zh-CN": "影像叙事(视频生成)"
  })
  @MonkeyToolInput([
    {
      "name": "8wnpp6",
      "displayName": {
        "zh-CN": "图片"
      },
      "type": "file"
    },
    {
      "name": "98mmpj",
      "displayName": {
        "zh-CN": "动作说明"
      },
      "type": "string"
    }
  ])
  @MonkeyToolOutput([
    {
      name: 'data',
      displayName: {
        'zh-CN': '结果',
        'en-US': 'Result',
      },
      required: true,
      type: 'string',
    },
  ])
  public async visualStorytellingVideoGeneration(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54ae24e8d6f9fc152eed9',
      inputData: body,
    });
  }

  @Post('design_concept_export')
  @MonkeyToolName('design_concept_export')
  @MonkeyToolCategories(['feature'])
  @MonkeyToolIcon('lucide:folder_up')
  @MonkeyToolDisplayName({
    "en-US": "Design Concept Export",
    "zh-CN": "设计概念导出"
  })
  @MonkeyToolInput([
    {
      "name": "kdzm7m",
      "displayName": {
        "zh-CN": "图像描述"
      },
      "type": "file"
    },
    {
      "name": "9qh9fp",
      "displayName": {
        "zh-CN": "文本描述"
      },
      "type": "string"
    }
  ])
  @MonkeyToolOutput([
    {
      name: 'data',
      displayName: {
        'zh-CN': '结果',
        'en-US': 'Result',
      },
      required: true,
      type: 'string',
    },
  ])
  public async designConceptExport(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54e3059d3162af127d4d7',
      inputData: body,
    });
  }

  @Post('market_environment_analysis')
  @MonkeyToolName('market_environment_analysis')
  @MonkeyToolCategories(['feature'])
  @MonkeyToolIcon('lucide:atom')
  @MonkeyToolDisplayName({
    "en-US": "Market Environment Analysis",
    "zh-CN": "市场环境分析"
  })
  @MonkeyToolInput([
    {
      "name": "8npnpp",
      "displayName": {
        "en-US": "product information",
        "zh-CN": "产品信息"
      },
      "type": "string"
    }
  ])
  @MonkeyToolOutput([
    {
      name: 'data',
      displayName: {
        'zh-CN': '结果',
        'en-US': 'Result',
      },
      required: true,
      type: 'string',
    },
  ])
  public async marketEnvironmentAnalysis(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54e4204cc340c5d118bda',
      inputData: body,
    });
  }

  @Post('functional_detail_refinement')
  @MonkeyToolName('functional_detail_refinement')
  @MonkeyToolCategories(['feature', 'logic'])
  @MonkeyToolIcon('lucide:square_function')
  @MonkeyToolDisplayName({
    "en-US": "Functional Detail Refinement",
    "zh-CN": "功能要点细化"
  })
  @MonkeyToolInput([
    {
      "name": "kz7gqj",
      "displayName": {
        "zh-CN": "竞品分析"
      },
      "type": "string"
    },
    {
      "name": "969mgh",
      "description": "",
      "displayName": {
        "zh-CN": "功能改进方向"
      },
      "required": false,
      "type": "number"
    }
  ])
  @MonkeyToolOutput([
    {
      name: 'data',
      displayName: {
        'zh-CN': '结果',
        'en-US': 'Result',
      },
      required: true,
      type: 'string',
    },
  ])
  public async functionalDetailRefinement(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54e7cd1406fc417f9d31f',
      inputData: body,
    });
  }

  @Post('design_solution_generation')
  @MonkeyToolName('design_solution_generation')
  @MonkeyToolCategories(['feature', 'prototype'])
  @MonkeyToolIcon('lucide:git_pull_request_create')
  @MonkeyToolDisplayName({
    "en-US": "Design Solution Generation",
    "zh-CN": "设计方案生成"
  })
  @MonkeyToolInput([
    {
      "name": "wqjkth",
      "displayName": {
        "zh-CN": "用户需求场景"
      },
      "type": "string"
    },
    {
      "name": "j7cztb",
      "displayName": {
        "zh-CN": "主要功能改进方向"
      },
      "type": "string"
    },
    {
      "name": "fjtn9b",
      "displayName": {
        "zh-CN": "次要功能改进方向"
      },
      "type": "string"
    }
  ])
  @MonkeyToolOutput([
    {
      name: 'data',
      displayName: {
        'zh-CN': '结果',
        'en-US': 'Result',
      },
      required: true,
      type: 'string',
    },
  ])
  public async designSolutionGeneration(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54e8e06b4d3a37a729a05',
      inputData: body,
    });
  }

  @Post('design_solution_iteration')
  @MonkeyToolName('design_solution_iteration')
  @MonkeyToolCategories(['feature', 'prototype'])
  @MonkeyToolIcon('lucide:iteration_ccw')
  @MonkeyToolDisplayName({
    "en-US": "Design Solution Iteration",
    "zh-CN": "设计方案迭代"
  })
  @MonkeyToolInput([
    {
      "name": "8nqrfz",
      "displayName": {
        "zh-CN": "产品描述文本"
      },
      "type": "string"
    }
  ])
  @MonkeyToolOutput([
    {
      name: 'data',
      displayName: {
        'zh-CN': '结果',
        'en-US': 'Result',
      },
      required: true,
      type: 'string',
    },
  ])
  public async designSolutionIteration(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54e9f93827eab8a990beb',
      inputData: body,
    });
  }
}
