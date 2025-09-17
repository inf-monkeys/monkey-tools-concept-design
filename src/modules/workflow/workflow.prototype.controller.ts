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

@Controller('workflow/prototype')
@UseGuards(new AuthGuard())
export class WorkflowPrototypeController {
  constructor(private readonly service: WorkflowService) { }

  @Post('visual_concept_exploration_image_generation')
  @MonkeyToolName('visual_concept_exploration_image_generation')
  @MonkeyToolCategories([])
  @MonkeyToolIcon('lucide:copy_image')
  @MonkeyToolDisplayName({
    "en-US": "Visual Concept Exploration (Image Generation)",
    "zh-CN": "视觉概念探索 (图像生成)"
  })
  @MonkeyToolInput([
    {
      "name": "b7jbtd",
      "displayName": {
        "zh-CN": "图片上传"
      },
      "type": "file"
    },
    {
      "name": "8nntq7",
      "description": "",
      "displayName": {
        "zh-CN": "提示词"
      },
      "required": false,
      "type": "string"
    },
    {
      "name": "pmz87z",
      "displayName": {
        "zh-CN": "生成数量"
      },
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
  public async visualConceptExplorationImageGeneration(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54d6b0e508d7bb541698e',
      inputData: body,
    });
  }

  @Post('stylized_rendering_image_style_transfer')
  @MonkeyToolName('stylized_rendering_image_style_transfer')
  @MonkeyToolCategories([])
  @MonkeyToolIcon('lucide:images')
  @MonkeyToolDisplayName({
    "en-US": "Stylized Rendering (Image Style Transfer)",
    "zh-CN": "风格化渲染 (图像风格迁移)"
  })
  @MonkeyToolInput([
    {
      "name": "b7jbtd",
      "description": "",
      "displayName": {
        "zh-CN": "原图"
      },
      "required": false,
      "type": "file"
    },
    {
      "name": "qbqnn8",
      "displayName": {
        "zh-CN": "参考图"
      },
      "type": "file"
    },
    {
      "name": "8nntq7",
      "description": "",
      "displayName": {
        "zh-CN": "提示词"
      },
      "required": false,
      "type": "string"
    },
    {
      "name": "pmz87z",
      "displayName": {
        "zh-CN": "生成数量"
      },
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
  public async stylizedRenderingImageStyleTransfer(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54d837431da91660dfe67',
      inputData: body,
    });
  }

  @Post('image_element_embedding_object_editing')
  @MonkeyToolName('image_element_embedding_object_editing')
  @MonkeyToolCategories([])
  @MonkeyToolIcon('lucide:image_plus')
  @MonkeyToolDisplayName({
    "en-US": "Image Element Embedding (Object Editing)",
    "zh-CN": "图像元素嵌入 (图像对象编辑)"
  })
  @MonkeyToolInput([
    {
      "name": "fgjfck",
      "description": "",
      "displayName": {
        "zh-CN": "背景图"
      },
      "required": false,
      "type": "file"
    },
    {
      "name": "kp7rpt",
      "displayName": {
        "zh-CN": "对象物体"
      },
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
  public async imageElementEmbeddingObjectEditing(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54d9a649359decddec18e',
      inputData: body,
    });
  }

  @Post('controlled_visual_exploration_controlled_image_generation')
  @MonkeyToolName('controlled_visual_exploration_controlled_image_generation')
  @MonkeyToolCategories([])
  @MonkeyToolIcon('lucide:book_image')
  @MonkeyToolDisplayName({
    "en-US": "Controlled Visual Exploration (Controlled Image Generation)",
    "zh-CN": "视觉要素可控探索 (受控图像生成)"
  })
  @MonkeyToolInput([
    {
      "name": "7jcjpw",
      "displayName": {
        "zh-CN": "参考图"
      },
      "type": "file"
    },
    {
      "name": "c8fjkq",
      "displayName": {
        "zh-CN": "提示词"
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
  public async controlledVisualExplorationControlledImageGeneration(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54dafd3506ee037534ddb',
      inputData: body,
    });
  }

  @Post('appearance_feature_generation')
  @MonkeyToolName('appearance_feature_generation')
  @MonkeyToolCategories([])
  @MonkeyToolIcon('lucide:scan_face')
  @MonkeyToolDisplayName({
    "en-US": "Appearance Feature Generation",
    "zh-CN": "外观特征生成"
  })
  @MonkeyToolInput([
    {
      "name": "fr8th7",
      "displayName": {
        "zh-CN": "前置分析"
      },
      "type": "string"
    },
    {
      "name": "9nqjzq",
      "displayName": {
        "zh-CN": "情感描述"
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
  public async appearanceFeatureGeneration(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54e1d5e3cfd5f52c2ffea',
      inputData: body,
    });
  }
}
