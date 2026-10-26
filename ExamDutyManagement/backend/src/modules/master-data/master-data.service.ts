import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City, Center, Exam, Role, Shift, Employee } from '../../entities';

@Injectable()
export class MasterDataService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepo: Repository<City>,
    @InjectRepository(Center)
    private readonly centerRepo: Repository<Center>,
    @InjectRepository(Exam)
    private readonly examRepo: Repository<Exam>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Shift)
    private readonly shiftRepo: Repository<Shift>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  async getCities(): Promise<City[]> {
    const allCities = await this.cityRepo.find({ order: { name: 'ASC' } });
    const orderMap: Record<string, number> = {
      'Mysore': 1,
      'Bengaluru': 2,
      'Mangalore': 3,
      'Shivmogga': 4,
      'Mandya': 5,
      'Davanagere': 6,
      'Dharwad': 7,
    };
    return allCities.sort((a, b) => (orderMap[a.name] || 99) - (orderMap[b.name] || 99));
  }

  async createCity(dto: { name: string; state?: string }): Promise<City> {
    if (!dto.name?.trim()) {
      throw new BadRequestException('City Name is required.');
    }
    const cleanName = dto.name.trim();
    const existing = await this.cityRepo.findOne({
      where: { name: cleanName },
    });
    if (existing) {
      throw new ConflictException(`City "${cleanName}" already exists.`);
    }
    const city = this.cityRepo.create({
      name: cleanName,
      state: dto.state?.trim() || 'Karnataka',
    });
    return this.cityRepo.save(city);
  }

  async deleteCity(id: string): Promise<{ message: string }> {
    const city = await this.cityRepo.findOne({ where: { id } });
    if (!city) throw new NotFoundException('City not found.');
    await this.cityRepo.remove(city);
    return { message: `City "${city.name}" deleted successfully.` };
  }

  async updateCity(id: string, dto: { name?: string; state?: string }): Promise<City> {
    const city = await this.cityRepo.findOne({ where: { id } });
    if (!city) throw new NotFoundException('City not found.');
    if (dto.name?.trim()) city.name = dto.name.trim();
    if (dto.state !== undefined) city.state = dto.state?.trim() || 'Karnataka';
    return this.cityRepo.save(city);
  }

  async getCenters(cityId?: string): Promise<Center[]> {
    const where = cityId ? { cityId } : {};
    return this.centerRepo.find({
      where,
      relations: ['city'],
      order: { centerName: 'ASC' },
    });
  }

  async createCenter(dto: {
    centerCode: string;
    centerName: string;
    cityId: string;
    address?: string;
  }): Promise<Center> {
    if (!dto.centerCode?.trim() || !dto.centerName?.trim() || !dto.cityId?.trim()) {
      throw new BadRequestException('Center Code, Center Name, and City are required.');
    }
    const cleanCode = dto.centerCode.trim();
    const existing = await this.centerRepo.findOne({
      where: { centerCode: cleanCode },
    });
    if (existing) {
      throw new ConflictException(`Center with code "${cleanCode}" already exists.`);
    }
    const center = this.centerRepo.create({
      centerCode: cleanCode,
      centerName: dto.centerName.trim(),
      cityId: dto.cityId.trim(),
      address: dto.address?.trim() || undefined,
    });
    const saved = await this.centerRepo.save(center);
    return (await this.centerRepo.findOne({ where: { id: saved.id }, relations: ['city'] })) || saved;
  }

  async updateCenter(
    id: string,
    dto: { centerCode?: string; centerName?: string; cityId?: string; address?: string },
  ): Promise<Center> {
    const center = await this.centerRepo.findOne({ where: { id }, relations: ['city'] });
    if (!center) throw new NotFoundException('Center not found.');
    if (dto.centerCode?.trim()) center.centerCode = dto.centerCode.trim();
    if (dto.centerName?.trim()) center.centerName = dto.centerName.trim();
    if (dto.cityId?.trim()) center.cityId = dto.cityId.trim();
    if (dto.address !== undefined) center.address = dto.address?.trim() || undefined;
    await this.centerRepo.save(center);
    return (await this.centerRepo.findOne({ where: { id }, relations: ['city'] })) || center;
  }

  async deleteCenter(id: string): Promise<{ message: string }> {
    const center = await this.centerRepo.findOne({ where: { id } });
    if (!center) throw new NotFoundException('Center not found.');
    await this.centerRepo.remove(center);
    return { message: `Center "${center.centerName}" deleted successfully.` };
  }

  async getExams(): Promise<Exam[]> {
    return this.examRepo.find({ order: { name: 'ASC' } });
  }

  async createExam(dto: {
    name: string;
    code?: string;
    type?: string;
  }): Promise<Exam> {
    if (!dto.name?.trim()) {
      throw new BadRequestException('Exam Name is required.');
    }
    const cleanName = dto.name.trim();
    const existing = await this.examRepo.findOne({
      where: { name: cleanName },
    });
    if (existing) {
      throw new ConflictException(`Exam "${cleanName}" already exists.`);
    }
    const exam = this.examRepo.create({
      name: cleanName,
      code: dto.code?.trim() || cleanName.toUpperCase().replace(/\s+/g, '-').slice(0, 10),
      type: dto.type === 'Mock' ? 'Mock' : 'Exam',
    });
    return this.examRepo.save(exam);
  }

  async updateExam(
    id: string,
    dto: { name?: string; code?: string; type?: string },
  ): Promise<Exam> {
    const exam = await this.examRepo.findOne({ where: { id } });
    if (!exam) throw new NotFoundException('Exam not found.');
    if (dto.name?.trim()) exam.name = dto.name.trim();
    if (dto.code !== undefined) exam.code = dto.code?.trim() || undefined;
    if (dto.type) exam.type = dto.type === 'Mock' ? 'Mock' : 'Exam';
    return this.examRepo.save(exam);
  }

  async deleteExam(id: string): Promise<{ message: string }> {
    const exam = await this.examRepo.findOne({ where: { id } });
    if (!exam) throw new NotFoundException('Exam not found.');
    await this.examRepo.remove(exam);
    return { message: `Exam "${exam.name}" deleted successfully.` };
  }

  async getRoles(): Promise<Role[]> {
    let roles = await this.roleRepo.find({ order: { name: 'ASC' } });
    const hasELS = roles.some(
      (r) =>
        r.name?.toLowerCase() === 'equity lab supervisior_ ssc'.toLowerCase() ||
        r.code?.toUpperCase() === 'ELS_SSC',
    );
    if (!hasELS) {
      try {
        const newRole = await this.roleRepo.save({
          name: 'Equity Lab Supervisior_ ssc',
          code: 'ELS_SSC',
        });
        roles.push(newRole);
        roles.sort((a, b) => a.name.localeCompare(b.name));
      } catch {
        // If inserted concurrently, reload
        roles = await this.roleRepo.find({ order: { name: 'ASC' } });
      }
    }
    return roles;
  }

  async getShifts(): Promise<Shift[]> {
    let allShifts = await this.shiftRepo.find({ order: { name: 'ASC' } });
    const hasShift3 = allShifts.some((s) => s.name === 'Shift 3');
    if (!hasShift3) {
      try {
        const s3 = await this.shiftRepo.save({
          name: 'Shift 3',
          defaultReportingTime: '03:30 PM',
          defaultEndTime: '09:30 PM',
        });
        allShifts.push(s3);
      } catch {
        allShifts = await this.shiftRepo.find({ order: { name: 'ASC' } });
      }
    }
    const allowed = ['Shift 1', 'Shift 2', 'Shift 3'];
    const filtered = allShifts.filter((s) => allowed.includes(s.name));
    return filtered.length > 0 ? filtered : allShifts;
  }

  async getEmployees(): Promise<Employee[]> {
    return this.employeeRepo.find({
      select: ['id', 'resourceId', 'name', 'mobile', 'email', 'aadhaarNumber', 'panNumber', 'city', 'status', 'isIdentityVerified', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async createEmployee(dto: {
    resourceId: string;
    name: string;
    mobile: string;
    email?: string;
    aadhaarNumber?: string;
    panNumber?: string;
    city?: string;
    isIdentityVerified?: boolean;
  }): Promise<Employee> {
    if (!dto.resourceId || !dto.name || !dto.mobile) {
      throw new BadRequestException('Resource ID, Full Name, and Contact / Mobile Number are required.');
    }
    const resId = dto.resourceId.trim();
    const existing = await this.employeeRepo.findOne({
      where: [{ resourceId: resId }, { mobile: dto.mobile.trim() }],
    });
    if (existing) {
      throw new ConflictException(
        `An employee with Resource ID "${resId}" or Contact Number "${dto.mobile.trim()}" already exists.`,
      );
    }

    const hasIdDetails = Boolean(
      dto.aadhaarNumber?.trim() && dto.panNumber?.trim()
    );

    const emp = this.employeeRepo.create({
      resourceId: resId,
      name: dto.name.trim(),
      mobile: dto.mobile.trim(),
      email: dto.email?.trim() || undefined,
      aadhaarNumber: dto.aadhaarNumber?.trim() || undefined,
      panNumber: dto.panNumber?.trim()?.toUpperCase() || undefined,
      city: dto.city?.trim() || undefined,
      isIdentityVerified: dto.isIdentityVerified ?? hasIdDetails,
      status: 'Active',
    });
    const savedEmp = await this.employeeRepo.save(emp);

    console.log('\x1b[32m====================================================\x1b[0m');
    console.log('\x1b[32m✔ DATABASE CONNECTED SUCCESSFULLY\x1b[0m');
    console.log(`✔ [Employee Added] Name: ${savedEmp.name} (Resource ID: ${savedEmp.resourceId})`);
    console.log('\x1b[32m====================================================\x1b[0m');

    return savedEmp;
  }

  async getEmployeeByResourceId(resourceId: string): Promise<Employee & { isIdentityVerified: boolean }> {
    const emp = await this.employeeRepo.findOne({
      where: { resourceId: resourceId.trim() },
      select: ['id', 'resourceId', 'name', 'mobile', 'email', 'aadhaarNumber', 'panNumber', 'city', 'status', 'isIdentityVerified'],
    });
    if (!emp) {
      throw new NotFoundException(`Employee with Resource ID "${resourceId}" not found.`);
    }
    const isVerified = Boolean(
      emp.isIdentityVerified ||
      (emp.aadhaarNumber && emp.aadhaarNumber.trim().length >= 10 &&
       emp.panNumber && emp.panNumber.trim().length >= 8)
    );
    return Object.assign(emp, { isIdentityVerified: isVerified });
  }

  async updateEmployee(
    resourceId: string,
    dto: {
      name?: string;
      mobile?: string;
      email?: string;
      aadhaarNumber?: string;
      panNumber?: string;
      city?: string;
      isIdentityVerified?: boolean;
    },
  ): Promise<Employee> {
    const emp = await this.employeeRepo.findOne({
      where: { resourceId: resourceId.trim() },
    });
    if (!emp) {
      throw new NotFoundException(`Employee with Resource ID "${resourceId}" not found.`);
    }
    if (dto.name) emp.name = dto.name.trim();
    if (dto.mobile) emp.mobile = dto.mobile.trim();
    if (dto.email !== undefined) emp.email = dto.email ? dto.email.trim() : undefined;
    if (dto.aadhaarNumber !== undefined) emp.aadhaarNumber = dto.aadhaarNumber ? dto.aadhaarNumber.trim() : undefined;
    if (dto.panNumber !== undefined) emp.panNumber = dto.panNumber ? dto.panNumber.trim().toUpperCase() : undefined;
    if (dto.city !== undefined) emp.city = dto.city ? dto.city.trim() : undefined;
    if (dto.isIdentityVerified !== undefined) {
      emp.isIdentityVerified = dto.isIdentityVerified;
    } else if (emp.aadhaarNumber && emp.panNumber) {
      emp.isIdentityVerified = true;
    }
    return this.employeeRepo.save(emp);
  }

  async deleteEmployee(resourceId: string): Promise<{ message: string }> {
    const emp = await this.employeeRepo.findOne({
      where: { resourceId: resourceId.trim() },
    });
    if (!emp) {
      throw new NotFoundException(`Employee with Resource ID "${resourceId}" not found.`);
    }
    if (emp.resourceId === '17655') {
      throw new BadRequestException('Primary system administrator cannot be deleted.');
    }
    await this.employeeRepo.remove(emp);
    return { message: `Employee "${emp.name}" (ID: ${emp.resourceId}) was deleted successfully.` };
  }
}
