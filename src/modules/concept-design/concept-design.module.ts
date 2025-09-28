import { Module } from '@nestjs/common';
import { ConceptDesignController } from './concept-design.controller';
import { ConceptDesignService } from './concept-design.service';

@Module({
  controllers: [ConceptDesignController],
  providers: [ConceptDesignService],
})
export class ConceptDesignModule {}

