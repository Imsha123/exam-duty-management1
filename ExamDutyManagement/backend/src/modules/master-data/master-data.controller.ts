import { Controller, Get, Post, Put, Delete, Body, Query, Param } from '@nestjs/common';
import { MasterDataService } from './master-data.service';

@Controller()
export class MasterDataController {
  constructor(private readonly masterDataService: MasterDataService) {}

  @Get('cities')
  async getCities() {
    return this.masterDataService.getCities();
  }

  @Post('cities')
  async createCity(@Body() body: { name: string; state?: string }) {
    return this.masterDataService.createCity(body);
  }

  @Delete('cities/:id')
  async deleteCity(@Param('id') id: string) {
    return this.masterDataService.deleteCity(id);
  }

  @Put('cities/:id')
  async updateCity(
    @Param('id') id: string,
    @Body() body: { name?: string; state?: string },
  ) {
    return this.masterDataService.updateCity(id, body);
  }

  @Get('centers')
  async getCenters(@Query('cityId') cityId?: string) {
    return this.masterDataService.getCenters(cityId);
  }

  @Post('centers')
  async createCenter(
    @Body() body: { centerCode: string; centerName: string; cityId: string; address?: string },
  ) {
    return this.masterDataService.createCenter(body);
  }

  @Put('centers/:id')
  async updateCenter(
    @Param('id') id: string,
    @Body() body: { centerCode?: string; centerName?: string; cityId?: string; address?: string },
  ) {
    return this.masterDataService.updateCenter(id, body);
  }

  @Delete('centers/:id')
  async deleteCenter(@Param('id') id: string) {
    return this.masterDataService.deleteCenter(id);
  }

  @Get('exams')
  async getExams() {
    return this.masterDataService.getExams();
  }

  @Post('exams')
  async createExam(@Body() body: { name: string; code?: string; type?: string }) {
    return this.masterDataService.createExam(body);
  }

  @Put('exams/:id')
  async updateExam(
    @Param('id') id: string,
    @Body() body: { name?: string; code?: string; type?: string },
  ) {
    return this.masterDataService.updateExam(id, body);
  }

  @Delete('exams/:id')
  async deleteExam(@Param('id') id: string) {
    return this.masterDataService.deleteExam(id);
  }

  @Get('roles')
  async getRoles() {
    return this.masterDataService.getRoles();
  }

  @Get('shifts')
  async getShifts() {
    return this.masterDataService.getShifts();
  }

  @Get('employees')
  async getEmployees() {
    return this.masterDataService.getEmployees();
  }

  @Get('employees/:resourceId')
  async getEmployeeByResourceId(@Param('resourceId') resourceId: string) {
    return this.masterDataService.getEmployeeByResourceId(resourceId);
  }

  @Post('employees')
  async createEmployee(
    @Body()
    body: {
      resourceId: string;
      name: string;
      mobile: string;
      email?: string;
      aadhaarNumber?: string;
      panNumber?: string;
      city?: string;
      isIdentityVerified?: boolean;
    },
  ) {
    return this.masterDataService.createEmployee(body);
  }

  @Put('employees/:resourceId')
  async updateEmployee(
    @Param('resourceId') resourceId: string,
    @Body()
    body: {
      name?: string;
      mobile?: string;
      email?: string;
      aadhaarNumber?: string;
      panNumber?: string;
      city?: string;
      isIdentityVerified?: boolean;
    },
  ) {
    return this.masterDataService.updateEmployee(resourceId, body);
  }

  @Delete('employees/:resourceId')
  async deleteEmployee(@Param('resourceId') resourceId: string) {
    return this.masterDataService.deleteEmployee(resourceId);
  }
}
