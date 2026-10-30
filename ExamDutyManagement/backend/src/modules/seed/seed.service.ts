import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Employee,
  City,
  Center,
  Exam,
  Role,
  Shift,
  Duty,
} from '../../entities';
import { MASTER_CITIES, MASTER_CENTERS, MASTER_EMPLOYEES } from './master-dataset';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
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
    @InjectRepository(Duty)
    private readonly dutyRepo: Repository<Duty>,
  ) {}

  async onModuleInit() {
    try {
      this.logger.log('Checking database seed data...');
      await this.seedMasterData();
      await this.ensureTargetCitiesAndCenters();
      await this.seedEmployeeAndDuties();
      this.logger.log('Database verification and seed completed.');
    } catch (error) {
      this.logger.error('Error during database seed:', error);
    }
  }

  private async seedMasterData() {
    // 1. Cities (All 25 cities from Excel)
    this.logger.log('Verifying all 25 cities...');
    for (const c of MASTER_CITIES) {
      const exists = await this.cityRepo.findOne({ where: { name: c.name } });
      if (!exists) {
        await this.cityRepo.save({ name: c.name, state: c.state });
      }
    }

    const allCities = await this.cityRepo.find();
    const findCityForName = (cityName: string): City => {
      const cleanTarget = cityName.toLowerCase().replace(/[^a-z]/g, '');
      const match = allCities.find((c) => {
        const cleanC = c.name.toLowerCase().replace(/[^a-z]/g, '');
        return cleanC === cleanTarget || cleanC.includes(cleanTarget) || cleanTarget.includes(cleanC);
      });
      return match || allCities[0];
    };

    // 2. Centers (All 113 centers from Excel)
    this.logger.log('Verifying all 113 centers...');
    for (const cnt of MASTER_CENTERS) {
      const exists = await this.centerRepo.findOne({ where: { centerCode: cnt.centerCode } });
      const city = findCityForName(cnt.city);
      if (!exists) {
        await this.centerRepo.save({
          centerCode: cnt.centerCode,
          centerName: cnt.centerName,
          cityId: city.id,
          address: cnt.address,
        });
      }
    }

    // 3. Exams
    const examList = [
      { name: 'NEET', code: 'NEET', type: 'Exam' },
      { name: 'JEE Main', code: 'JEE', type: 'Exam' },
      { name: 'JEE Main 2026 Session 2', code: 'JEE-M-S2', type: 'Exam' },
      { name: 'UGC NET', code: 'NET', type: 'Exam' },
      { name: 'TCS', code: 'TCS', type: 'Exam' },
      { name: 'IBPS PO Mains 2026', code: 'IBPS-PO-M', type: 'Exam' },
      { name: 'SSC CGL Tier 1 2026', code: 'SSC-CGL-26', type: 'Exam' },
      { name: 'RRB NTPC Phase 1', code: 'RRB-NTPC-01', type: 'Exam' },
      { name: 'UPSC NDA 2026', code: 'UPSC-NDA', type: 'Exam' },
      { name: 'AIIMS Mock', code: 'AIIMS', type: 'Mock' },
      { name: 'GATE Mock', code: 'GATE', type: 'Mock' },
      { name: 'Mock Drill 2026', code: 'MOCK-DR-26', type: 'Mock' },
      { name: 'National Mock Exam 2026', code: 'NAT-MOCK', type: 'Mock' },
    ];
    for (const ex of examList) {
      const exists = await this.examRepo.findOne({ where: { name: ex.name } });
      if (!exists) {
        await this.examRepo.save(ex);
      }
    }

    // 4. Roles
    const roleCount = await this.roleRepo.count();
    if (roleCount === 0) {
      this.logger.log('Seeding roles...');
      await this.roleRepo.save([
        { name: 'M OT', code: 'MOT' },
        { name: 'SO', code: 'SO' },
        { name: 'HOT(IT Manager)', code: 'HOT' },
        { name: 'CCTV', code: 'CCTV' },
        { name: 'Equity Lab Supervisior_ ssc', code: 'ELS_SSC' },
      ]);
    }

    // 5. Shifts
    const shiftCount = await this.shiftRepo.count();
    if (shiftCount === 0) {
      this.logger.log('Seeding shifts...');
      await this.shiftRepo.save([
        {
          name: 'Shift 1',
          defaultReportingTime: '07:30 AM',
          defaultEndTime: '01:30 PM',
        },
        {
          name: 'Shift 2',
          defaultReportingTime: '12:30 PM',
          defaultEndTime: '06:30 PM',
        },
        {
          name: 'Shift 3',
          defaultReportingTime: '05:30 PM',
          defaultEndTime: '10:00 PM',
        },
      ]);
    }
  }

  private async seedEmployeeAndDuties() {
    let employee = await this.employeeRepo.findOne({
      where: { resourceId: '17655' },
    });

    if (!employee) {
      this.logger.log('Seeding temporary Admin user Sanjeev Kumar N (17655)...');
      employee = await this.employeeRepo.save({
        resourceId: '17655',
        name: 'Sanjeev Kumar N',
        mobile: '9876543210',
        email: 'sanjeev.kumar@gmail.com',
        city: 'Mysuru',
        status: 'Active',
      });
    }

    // Sanjeev Kumar is strictly the temporary Admin account. Do NOT seed dummy duties for him.
    // Clean up any remaining legacy dummy duties for Sanjeev Kumar:
    const adminDuties = await this.dutyRepo.find({
      where: { employeeId: employee.id },
    });
    if (adminDuties.length > 0) {
      this.logger.log(`Cleaning up ${adminDuties.length} dummy duties for admin Sanjeev Kumar N...`);
      await this.dutyRepo.remove(adminDuties);
    }

    // Ensure Employee rajesh (597305) exists
    let rajesh = await this.employeeRepo.findOne({ where: { resourceId: '597305' } });
    if (!rajesh) {
      rajesh = await this.employeeRepo.save({
        resourceId: '597305',
        name: 'rajesh',
        mobile: '9886915446',
        email: 'rajesh@gmail.com',
        city: 'Mysore',
        status: 'Active',
      });
    }

    // Ensure all 47 master employees exist
    for (const me of MASTER_EMPLOYEES) {
      const existing = await this.employeeRepo.findOne({
        where: [{ resourceId: me.resourceId }, { mobile: me.mobile }],
      });
      if (!existing) {
        await this.employeeRepo.save({
          resourceId: me.resourceId,
          name: me.name,
          mobile: me.mobile,
          email: me.email || undefined,
          city: me.city || undefined,
          aadhaarNumber: me.aadhaarNumber || undefined,
          panNumber: me.panNumber || undefined,
          isIdentityVerified: true,
          status: 'Active',
        });
      }
    }

    // Ensure rajesh has assigned duty with all details
    const rajeshDuties = await this.dutyRepo.find({
      where: [{ employeeId: rajesh.id }, { employeeId: '597305' }],
    });
    if (rajeshDuties.length === 0) {
      const allCities = await this.cityRepo.find();
      const city = allCities.find((c) => c.name.toLowerCase().includes('myso')) || allCities[0];
      const allCenters = await this.centerRepo.find();
      const center = (city ? allCenters.find((c) => c.cityId === city.id) : null) || allCenters[0];
      const allExams = await this.examRepo.find();
      const exam = allExams[0];
      const allRoles = await this.roleRepo.find();
      const role = allRoles.find((r) => r.code === 'MOT' || r.code === 'SO') || allRoles[0];
      const allShifts = await this.shiftRepo.find();
      const shift = allShifts[0];

      if (city && center && exam && role && shift) {
        const todayDate = new Date().toISOString().split('T')[0];
        await this.dutyRepo.save({
          employeeId: rajesh.id,
          dutyDate: todayDate,
          cityId: city.id,
          centerId: center.id,
          dutyType: exam.type || 'Exam',
          examId: exam.id,
          roleId: role.id,
          shiftId: shift.id,
          reportingTime: shift.defaultReportingTime || '07:30 AM',
          shiftEndTime: shift.defaultEndTime || '01:30 PM',
          status: 'Pending',
        });
        this.logger.log('Seeded examination duty for rajesh (597305)');
      }
    }
  }

  private async ensureTargetCitiesAndCenters() {
    try {
      this.logger.log('Ensuring all 25 cities and 113 centers from Excel are synchronized...');

      // 1. Point any centers and duties attached to legacy "Bangalore" to "Bengaluru"
      const bengaluru = await this.cityRepo.findOne({ where: { name: 'Bengaluru' } });
      const bangalore = await this.cityRepo.findOne({ where: { name: 'Bangalore' } });
      if (bengaluru && bangalore) {
        const centersInBangalore = await this.centerRepo.find({ where: { cityId: bangalore.id } });
        for (const c of centersInBangalore) {
          c.cityId = bengaluru.id;
          await this.centerRepo.save(c);
        }
        const dutiesInBangalore = await this.dutyRepo.find({ where: { cityId: bangalore.id } });
        for (const d of dutiesInBangalore) {
          d.cityId = bengaluru.id;
          await this.dutyRepo.save(d);
        }
        await this.cityRepo.remove(bangalore);
      }

      // 2. Ensure all 25 master cities exist
      for (const mc of MASTER_CITIES) {
        const existing = await this.cityRepo.findOne({ where: { name: mc.name } });
        if (!existing) {
          await this.cityRepo.save({ name: mc.name, state: mc.state });
        }
      }

      // 3. Ensure all 113 master centers exist and map to their respective city
      const currentCities = await this.cityRepo.find();
      const findCity = (cityName: string): City => {
        const clean = cityName.toLowerCase().replace(/[^a-z]/g, '');
        const match = currentCities.find((c) => {
          const cClean = c.name.toLowerCase().replace(/[^a-z]/g, '');
          return cClean === clean || cClean.includes(clean) || clean.includes(cClean);
        });
        return match || currentCities[0];
      };

      for (const mc of MASTER_CENTERS) {
        const targetCity = findCity(mc.city);
        const existingCenter = await this.centerRepo.findOne({ where: { centerCode: mc.centerCode } });
        if (!existingCenter) {
          await this.centerRepo.save({
            centerCode: mc.centerCode,
            centerName: mc.centerName,
            cityId: targetCity.id,
            address: mc.address,
          });
        } else {
          let updated = false;
          if (existingCenter.centerName !== mc.centerName) {
            existingCenter.centerName = mc.centerName;
            updated = true;
          }
          if (targetCity && existingCenter.cityId !== targetCity.id) {
            existingCenter.cityId = targetCity.id;
            updated = true;
          }
          if (updated) {
            await this.centerRepo.save(existingCenter);
          }
        }
      }

      this.logger.log(`Master data verification complete: 25 cities and 113 centers ready.`);
    } catch (err) {
      this.logger.error('Error during ensureTargetCitiesAndCenters:', err);
    }
  }
}
