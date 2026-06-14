import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { AbandonApplicationDto } from './dto/abandon-application.dto';
import { QueryApplicationsDto } from './dto/query-applications.dto';

@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new credit application' })
  @ApiCreatedResponse({ description: 'Application created in DRAFT status' })
  create(@Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List applications with optional filters' })
  @ApiOkResponse({ description: 'Filtered list of applications' })
  findAll(@Query() query: QueryApplicationsDto) {
    return this.applicationsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get application detail' })
  @ApiOkResponse({ description: 'Application detail with events' })
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update application data (only if DRAFT)' })
  update(@Param('id') id: string, @Body() dto: UpdateApplicationDto) {
    return this.applicationsService.update(id, dto);
  }

  @Post(':id/simulate-offer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request preliminary offer simulation' })
  simulateOffer(@Param('id') id: string) {
    const { application, result } =
      this.applicationsService.simulateOffer(id);
    return { application, simulationResult: result };
  }

  @Post(':id/finalize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Finalize the application' })
  finalize(@Param('id') id: string) {
    return this.applicationsService.finalize(id);
  }

  @Post(':id/abandon')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Abandon the application with a reason' })
  abandon(@Param('id') id: string, @Body() dto: AbandonApplicationDto) {
    return this.applicationsService.abandon(id, dto);
  }

  @Get(':id/events')
  @ApiOperation({ summary: 'Get application event traceability' })
  @ApiOkResponse({ description: 'Chronological list of application events' })
  getEvents(@Param('id') id: string) {
    return this.applicationsService.getEvents(id);
  }
}
