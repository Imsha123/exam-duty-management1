import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../../entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  async login(
    resourceIdOrUsername: string,
    secret: string,
    loginType?: 'admin' | 'employee',
  ): Promise<Employee & { role: 'admin' | 'employee'; isAdmin: boolean }> {
    const identifier = (resourceIdOrUsername || '').trim();
    const rawSecret = (secret || '').trim();

    if (!identifier || !rawSecret) {
      throw new UnauthorizedException(
        'Please enter both Resource ID / Username and Mobile Number / Password.',
      );
    }

    const idLower = identifier.toLowerCase();

    // 1. Direct Admin Login for devsupport, Mohan, and admin
    if (idLower === 'devsupport' || idLower === 'mohan' || idLower === 'admin') {
      let isAuthorized = false;
      let adminName = 'Administrator';
      let adminResId = identifier;

      if (idLower === 'devsupport') {
        if (rawSecret === 'dev@support123') {
          isAuthorized = true;
          adminName = 'Mohan';
          adminResId = '5914';
        }
      } else if (idLower === 'mohan') {
        if (rawSecret === 'Mohan@123' || rawSecret.toLowerCase() === 'mohan@123') {
          isAuthorized = true;
          adminName = 'Mohan';
          adminResId = '5914';
        }
      } else if (idLower === 'admin') {
        if (rawSecret === '123' || rawSecret === '1234' || rawSecret === '12345' || rawSecret === '123456' || rawSecret.toLowerCase() === 'admin') {
          isAuthorized = true;
          adminName = 'Mohan';
          adminResId = '5914';
        }
      }

      if (!isAuthorized) {
        throw new UnauthorizedException(
          `Invalid credentials for ${identifier}. Please verify your password.`,
        );
      }

      // Find or attach admin employee record
      let adminEmployee = await this.employeeRepo.findOne({
        where: [{ resourceId: adminResId }, { resourceId: '5914' }, { resourceId: '17655' }],
      });

      const adminEmail = 'mohan@gmail.com';

      if (!adminEmployee) {
        adminEmployee = this.employeeRepo.create({
          id: `admin-5914-id`,
          resourceId: adminResId,
          name: adminName,
          mobile: '9876543210',
          email: adminEmail,
          city: 'Mysuru',
          status: 'Active',
          isIdentityVerified: true,
        });
      } else {
        adminEmployee.resourceId = adminResId;
        adminEmployee.name = adminName;
        adminEmployee.email = adminEmail;
      }

      return Object.assign(adminEmployee, {
        resourceId: adminResId,
        name: adminName,
        email: adminEmail,
        role: 'admin' as const,
        isAdmin: true,
        isIdentityVerified: true,
      });
    }

    // 2. Lookup employee by Resource ID (or mobile, or name)
    let employee = await this.employeeRepo.findOne({
      where: { resourceId: identifier },
    });

    if (!employee) {
      // Case insensitive lookup
      const allEmps = await this.employeeRepo.find();
      employee =
        allEmps.find(
          (e) =>
            e.resourceId.trim().toLowerCase() === identifier.toLowerCase() ||
            e.mobile.trim() === identifier ||
            e.name.trim().toLowerCase() === identifier.toLowerCase(),
        ) || null;
    }

    if (!employee) {
      throw new UnauthorizedException(
        `Resource ID or Username "${identifier}" not found. Please check your credentials.`,
      );
    }

    if (employee.status !== 'Active') {
      throw new UnauthorizedException('This employee account is currently inactive.');
    }

    // 3. Password / Secret verification
    // Allowed secrets for employee:
    // a) Registered mobile number
    // b) Default passwords (1234, 12345, 123456)
    // c) Resource ID
    // d) Stored passwordHash
    const isSameResourceId = rawSecret.toLowerCase() === employee.resourceId.trim().toLowerCase();
    const isMobileMatch = rawSecret === employee.mobile.trim();
    const isDefaultPassword = rawSecret === '1234' || rawSecret === '12345' || rawSecret === '123456';
    const isPasswordHashMatch = Boolean(employee.passwordHash && rawSecret === employee.passwordHash);

    const isPasswordValid = isSameResourceId || isMobileMatch || isDefaultPassword || isPasswordHashMatch;

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid credentials. Please enter your registered mobile number or password.',
      );
    }

    // 4. Role determination
    const resUpper = employee.resourceId.trim().toUpperCase();
    const isAdmin =
      resUpper === '17655' ||
      resUpper === 'ADMIN' ||
      resUpper === 'DEVSUPPORT' ||
      resUpper === 'MOHAN' ||
      resUpper === '5914' ||
      resUpper.includes('ADMIN') ||
      resUpper.includes('CHANDANA');

    const role: 'admin' | 'employee' = isAdmin ? 'admin' : 'employee';

    const isVerified = Boolean(
      employee.isIdentityVerified ||
      (employee.aadhaarNumber && employee.aadhaarNumber.trim().length >= 10 &&
       employee.panNumber && employee.panNumber.trim().length >= 8) ||
      true // Allows immediate access to employee web page
    );

    if (employee && employee.email) {
      if (!employee.email.endsWith('@gmail.com')) {
        employee.email = employee.email.replace(/@[^.]+.*$/, '@gmail.com');
      }
    }

    return Object.assign(employee, {
      role,
      isAdmin,
      isIdentityVerified: isVerified,
    });
  }

  async getProfile(resourceId?: string, employeeId?: string): Promise<Employee> {
    let employee: Employee | null = null;

    if (employeeId) {
      employee = await this.employeeRepo.findOne({ where: { id: employeeId } });
    } else if (resourceId) {
      const idTrim = resourceId.trim();
      const idLower = idTrim.toLowerCase();
      if (idLower === 'devsupport' || idLower === 'mohan' || idLower === 'admin' || idLower === '5914') {
        return {
          id: 'admin-5914-id',
          resourceId: '5914',
          name: 'Mohan',
          mobile: '9876543210',
          email: 'mohan@gmail.com',
          city: 'Mysuru',
          status: 'Active',
          isIdentityVerified: true,
        } as Employee;
      }
      employee = await this.employeeRepo.findOne({ where: { resourceId: idTrim } });
    } else {
      employee = await this.employeeRepo.findOne({ where: { resourceId: '17655' } });
    }

    if (!employee) {
      throw new NotFoundException('Employee profile not found.');
    }

    if (employee.email && !employee.email.endsWith('@gmail.com')) {
      employee.email = employee.email.replace(/@[^.]+.*$/, '@gmail.com');
    }

    return employee;
  }
}
