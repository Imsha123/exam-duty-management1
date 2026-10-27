import apiClient from './api';
import { INITIAL_CITIES, INITIAL_CENTERS, INITIAL_EXAMS } from '../data/masterData';

export interface City {
  id: string;
  name: string;
  state?: string;
}

export interface Center {
  id: string;
  centerCode: string;
  centerName: string;
  cityId: string;
  address?: string;
  city?: City;
}

export interface Exam {
  id: string;
  name: string;
  code?: string;
  type: string;
}

export interface Role {
  id: string;
  name: string;
  code: string;
}

export interface Shift {
  id: string;
  name: string;
  defaultReportingTime: string;
  defaultEndTime: string;
}

export interface EmployeeItem {
  id: string;
  resourceId: string;
  name: string;
  mobile: string;
  email?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  isIdentityVerified?: boolean;
  city?: string;
  status: string;
  role?: string;
  isAdmin?: boolean;
}

// Storage helpers for seamless instant synchronization across screens
const getStoredList = <T>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const setStoredList = <T>(key: string, list: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage`, err);
  }
};

export const masterService = {
  // ===================== CITIES =====================
  async getCities(): Promise<City[]> {
    let apiCities: City[] = [];
    try {
      const res = await apiClient.get<City[]>('/cities');
      if (Array.isArray(res.data)) {
        apiCities = res.data;
      }
    } catch (err) {
      console.warn('Backend /cities fetch failed, using local master cache', err);
    }

    const customCities = getStoredList<City>('custom_cities');
    const deletedCityIds = new Set(getStoredList<string>('deleted_city_ids'));

    // Merge: initial master cities (25 from Excel) + backend cities + custom cities, minus deleted
    const map = new Map<string, City>();
    INITIAL_CITIES.forEach((c) => {
      if (!deletedCityIds.has(c.id)) {
        map.set(c.id, c);
      }
    });

    apiCities.forEach((c) => {
      if (!deletedCityIds.has(c.id)) {
        // match existing by id or name
        const existing = Array.from(map.values()).find(
          (item) => item.id === c.id || item.name.toLowerCase() === c.name.toLowerCase(),
        );
        if (existing) {
          map.set(existing.id, { ...existing, ...c });
        } else {
          map.set(c.id, c);
        }
      }
    });

    customCities.forEach((c) => {
      if (!deletedCityIds.has(c.id)) {
        const existingId = Array.from(map.values()).find(
          (item) => item.id === c.id || item.name.toLowerCase() === c.name.toLowerCase(),
        );
        if (existingId) {
          map.set(existingId.id, { ...existingId, ...c });
        } else {
          map.set(c.id, c);
        }
      }
    });

    return Array.from(map.values());
  },

  async createCity(data: { name: string; state?: string }): Promise<City> {
    const cleanName = data.name.trim();
    const cleanState = data.state?.trim() || 'Karnataka';

    let created: City;
    try {
      const res = await apiClient.post<City>('/cities', { name: cleanName, state: cleanState });
      created = res.data;
    } catch (err) {
      console.warn('Backend POST /cities failed or unavailable, creating local city', err);
      created = {
        id: 'city-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        name: cleanName,
        state: cleanState,
      };
    }

    // Save into custom_cities
    const list = getStoredList<City>('custom_cities');
    const filtered = list.filter((c) => c.id !== created.id && c.name.toLowerCase() !== created.name.toLowerCase());
    filtered.push(created);
    setStoredList('custom_cities', filtered);

    // Unmark from deleted if re-created
    const deleted = getStoredList<string>('deleted_city_ids').filter((id) => id !== created.id);
    setStoredList('deleted_city_ids', deleted);

    window.dispatchEvent(new CustomEvent('exam_duty_master_updated', { detail: { type: 'city', action: 'create', data: created } }));
    return created;
  },

  async updateCity(id: string, data: { name?: string; state?: string }): Promise<City> {
    let updated: City;
    try {
      const res = await apiClient.put<City>(`/cities/${encodeURIComponent(id)}`, data);
      updated = res.data;
    } catch (err) {
      console.warn('Backend PUT /cities failed, updating locally', err);
      updated = {
        id,
        name: data.name?.trim() || '',
        state: data.state?.trim() || 'Karnataka',
      };
    }

    const list = getStoredList<City>('custom_cities');
    const idx = list.findIndex((c) => c.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updated };
    } else {
      list.push(updated);
    }
    setStoredList('custom_cities', list);

    window.dispatchEvent(new CustomEvent('exam_duty_master_updated', { detail: { type: 'city', action: 'update', data: updated } }));
    return updated;
  },

  async deleteCity(id: string): Promise<{ message: string }> {
    try {
      await apiClient.delete(`/cities/${encodeURIComponent(id)}`);
    } catch (err) {
      console.warn('Backend DELETE /cities failed, deleting locally', err);
    }

    const list = getStoredList<City>('custom_cities').filter((c) => c.id !== id);
    setStoredList('custom_cities', list);

    const deleted = getStoredList<string>('deleted_city_ids');
    if (!deleted.includes(id)) {
      deleted.push(id);
      setStoredList('deleted_city_ids', deleted);
    }

    window.dispatchEvent(new CustomEvent('exam_duty_master_updated', { detail: { type: 'city', action: 'delete', id } }));
    return { message: 'City deleted successfully' };
  },

  // ===================== EXAM CENTERS =====================
  async getCenters(cityId?: string): Promise<Center[]> {
    let apiCenters: Center[] = [];
    try {
      const url = cityId ? `/centers?cityId=${encodeURIComponent(cityId)}` : '/centers';
      const res = await apiClient.get<Center[]>(url);
      if (Array.isArray(res.data)) {
        apiCenters = res.data;
      }
    } catch (err) {
      console.warn('Backend /centers fetch failed, using local master cache', err);
    }

    const customCenters = getStoredList<Center>('custom_centers');
    const deletedCenterIds = new Set(getStoredList<string>('deleted_center_ids'));

    // Merge: initial master centers (113 from Excel) + backend centers + custom centers, minus deleted
    const map = new Map<string, Center>();
    INITIAL_CENTERS.forEach((c) => {
      if (!deletedCenterIds.has(c.id)) {
        map.set(c.id, c);
      }
    });

    apiCenters.forEach((c) => {
      if (!deletedCenterIds.has(c.id)) {
        const existing = Array.from(map.values()).find(
          (item) => item.id === c.id || item.centerCode.toLowerCase() === c.centerCode.toLowerCase(),
        );
        if (existing) {
          map.set(existing.id, { ...existing, ...c });
        } else {
          map.set(c.id, c);
        }
      }
    });

    customCenters.forEach((c) => {
      if (!deletedCenterIds.has(c.id)) {
        const existing = Array.from(map.values()).find(
          (item) => item.id === c.id || item.centerCode.toLowerCase() === c.centerCode.toLowerCase(),
        );
        if (existing) {
          map.set(existing.id, { ...existing, ...c });
        } else {
          map.set(c.id, c);
        }
      }
    });

    let results = Array.from(map.values());
    if (cityId) {
      const allCities = await this.getCities();
      const targetCity = allCities.find(
        (ct) => ct.id.toLowerCase() === cityId.toLowerCase() || ct.name.toLowerCase() === cityId.toLowerCase(),
      );
      const targetCityClean = targetCity
        ? targetCity.name.toLowerCase().replace(/[^a-z]/g, '')
        : cityId.toLowerCase().replace(/[^a-z]/g, '');

      results = results.filter((c) => {
        if (!c.cityId) return true;
        if (String(c.cityId).toLowerCase() === String(cityId).toLowerCase()) return true;
        if (targetCity && String(c.cityId).toLowerCase() === String(targetCity.id).toLowerCase()) return true;
        const centerCityClean = String(c.cityId).toLowerCase().replace(/[^a-z]/g, '');
        if (targetCityClean && (centerCityClean.includes(targetCityClean) || targetCityClean.includes(centerCityClean))) return true;
        if (c.city?.name) {
          const cNameClean = c.city.name.toLowerCase().replace(/[^a-z]/g, '');
          if (targetCityClean && (cNameClean.includes(targetCityClean) || targetCityClean.includes(cNameClean))) return true;
        }
        return false;
      });
    }
    return results;
  },

  async createCenter(data: {
    centerCode: string;
    centerName: string;
    cityId: string;
    address?: string;
  }): Promise<Center> {
    let created: Center;
    try {
      const res = await apiClient.post<Center>('/centers', data);
      created = res.data;
    } catch (err) {
      console.warn('Backend POST /centers failed, creating locally', err);
      created = {
        id: 'center-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        centerCode: data.centerCode.trim(),
        centerName: data.centerName.trim(),
        cityId: data.cityId,
        address: data.address?.trim() || undefined,
      };
    }

    const list = getStoredList<Center>('custom_centers');
    const filtered = list.filter((c) => c.id !== created.id && c.centerCode.toLowerCase() !== created.centerCode.toLowerCase());
    filtered.push(created);
    setStoredList('custom_centers', filtered);

    const deleted = getStoredList<string>('deleted_center_ids').filter((id) => id !== created.id);
    setStoredList('deleted_center_ids', deleted);

    window.dispatchEvent(new CustomEvent('exam_duty_master_updated', { detail: { type: 'center', action: 'create', data: created } }));
    return created;
  },

  async updateCenter(
    id: string,
    data: { centerCode?: string; centerName?: string; cityId?: string; address?: string },
  ): Promise<Center> {
    let updated: Center;
    try {
      const res = await apiClient.put<Center>(`/centers/${encodeURIComponent(id)}`, data);
      updated = res.data;
    } catch (err) {
      console.warn('Backend PUT /centers failed, updating locally', err);
      const existing = getStoredList<Center>('custom_centers').find((c) => c.id === id);
      updated = {
        id,
        centerCode: data.centerCode?.trim() || existing?.centerCode || '',
        centerName: data.centerName?.trim() || existing?.centerName || '',
        cityId: data.cityId || existing?.cityId || '',
        address: data.address !== undefined ? data.address.trim() : existing?.address,
      };
    }

    const list = getStoredList<Center>('custom_centers');
    const idx = list.findIndex((c) => c.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updated };
    } else {
      list.push(updated);
    }
    setStoredList('custom_centers', list);

    window.dispatchEvent(new CustomEvent('exam_duty_master_updated', { detail: { type: 'center', action: 'update', data: updated } }));
    return updated;
  },

  async deleteCenter(id: string): Promise<{ message: string }> {
    try {
      await apiClient.delete(`/centers/${encodeURIComponent(id)}`);
    } catch (err) {
      console.warn('Backend DELETE /centers failed, deleting locally', err);
    }

    const list = getStoredList<Center>('custom_centers').filter((c) => c.id !== id);
    setStoredList('custom_centers', list);

    const deleted = getStoredList<string>('deleted_center_ids');
    if (!deleted.includes(id)) {
      deleted.push(id);
      setStoredList('deleted_center_ids', deleted);
    }

    window.dispatchEvent(new CustomEvent('exam_duty_master_updated', { detail: { type: 'center', action: 'delete', id } }));
    return { message: 'Exam center deleted successfully' };
  },

  // ===================== EXAMS =====================
  async getExams(): Promise<Exam[]> {
    let apiExams: Exam[] = [];
    try {
      const res = await apiClient.get<Exam[]>('/exams');
      if (Array.isArray(res.data)) {
        apiExams = res.data;
      }
    } catch (err) {
      console.warn('Backend /exams fetch failed, using local master cache', err);
    }

    const customExams = getStoredList<Exam>('custom_exams');
    const deletedExamIds = new Set(getStoredList<string>('deleted_exam_ids'));

    // Merge: initial master exams + backend exams + custom exams, minus deleted
    const map = new Map<string, Exam>();
    INITIAL_EXAMS.forEach((x) => {
      if (!deletedExamIds.has(x.id)) {
        map.set(x.id, x);
      }
    });

    apiExams.forEach((x) => {
      if (!deletedExamIds.has(x.id)) {
        const existing = Array.from(map.values()).find(
          (item) => item.id === x.id || item.name.toLowerCase() === x.name.toLowerCase(),
        );
        if (existing) {
          map.set(existing.id, { ...existing, ...x });
        } else {
          map.set(x.id, x);
        }
      }
    });

    customExams.forEach((x) => {
      if (!deletedExamIds.has(x.id)) {
        const existing = Array.from(map.values()).find(
          (item) => item.id === x.id || item.name.toLowerCase() === x.name.toLowerCase(),
        );
        if (existing) {
          map.set(existing.id, { ...existing, ...x });
        } else {
          map.set(x.id, x);
        }
      }
    });

    return Array.from(map.values());
  },

  async createExam(data: { name: string; code?: string; type?: string }): Promise<Exam> {
    let created: Exam;
    try {
      const res = await apiClient.post<Exam>('/exams', data);
      created = res.data;
    } catch (err) {
      console.warn('Backend POST /exams failed, creating locally', err);
      created = {
        id: 'exam-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        name: data.name.trim(),
        code: data.code?.trim() || undefined,
        type: data.type === 'Mock' ? 'Mock' : 'Exam',
      };
    }

    const list = getStoredList<Exam>('custom_exams');
    const filtered = list.filter((x) => x.id !== created.id && x.name.toLowerCase() !== created.name.toLowerCase());
    filtered.push(created);
    setStoredList('custom_exams', filtered);

    const deleted = getStoredList<string>('deleted_exam_ids').filter((id) => id !== created.id);
    setStoredList('deleted_exam_ids', deleted);

    window.dispatchEvent(new CustomEvent('exam_duty_master_updated', { detail: { type: 'exam', action: 'create', data: created } }));
    return created;
  },

  async updateExam(id: string, data: { name?: string; code?: string; type?: string }): Promise<Exam> {
    let updated: Exam;
    try {
      const res = await apiClient.put<Exam>(`/exams/${encodeURIComponent(id)}`, data);
      updated = res.data;
    } catch (err) {
      console.warn('Backend PUT /exams failed, updating locally', err);
      const existing = getStoredList<Exam>('custom_exams').find((x) => x.id === id);
      updated = {
        id,
        name: data.name?.trim() || existing?.name || '',
        code: data.code !== undefined ? data.code.trim() : existing?.code,
        type: data.type === 'Mock' ? 'Mock' : 'Exam',
      };
    }

    const list = getStoredList<Exam>('custom_exams');
    const idx = list.findIndex((x) => x.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updated };
    } else {
      list.push(updated);
    }
    setStoredList('custom_exams', list);

    window.dispatchEvent(new CustomEvent('exam_duty_master_updated', { detail: { type: 'exam', action: 'update', data: updated } }));
    return updated;
  },

  async deleteExam(id: string): Promise<{ message: string }> {
    try {
      await apiClient.delete(`/exams/${encodeURIComponent(id)}`);
    } catch (err) {
      console.warn('Backend DELETE /exams failed, deleting locally', err);
    }

    const list = getStoredList<Exam>('custom_exams').filter((x) => x.id !== id);
    setStoredList('custom_exams', list);

    const deleted = getStoredList<string>('deleted_exam_ids');
    if (!deleted.includes(id)) {
      deleted.push(id);
      setStoredList('deleted_exam_ids', deleted);
    }

    window.dispatchEvent(new CustomEvent('exam_duty_master_updated', { detail: { type: 'exam', action: 'delete', id } }));
    return { message: 'Exam deleted successfully' };
  },

  // ===================== ROLES & SHIFTS & EMPLOYEES =====================
  async getRoles(): Promise<Role[]> {
    const res = await apiClient.get<Role[]>('/roles');
    return res.data;
  },

  async getShifts(): Promise<Shift[]> {
    const res = await apiClient.get<Shift[]>('/shifts');
    return res.data;
  },

  async getEmployees(): Promise<EmployeeItem[]> {
    const res = await apiClient.get<EmployeeItem[]>('/employees');
    return res.data;
  },

  async getEmployeeByResourceId(resourceId: string): Promise<EmployeeItem> {
    const res = await apiClient.get<EmployeeItem>(`/employees/${encodeURIComponent(resourceId)}`);
    return res.data;
  },

  async createEmployee(data: {
    resourceId: string;
    name: string;
    mobile: string;
    email?: string;
    aadhaarNumber?: string;
    panNumber?: string;
    isIdentityVerified?: boolean;
    city?: string;
  }): Promise<EmployeeItem> {
    const res = await apiClient.post<EmployeeItem>('/employees', data);
    return res.data;
  },

  async updateEmployee(
    resourceId: string,
    data: {
      name?: string;
      mobile?: string;
      email?: string;
      aadhaarNumber?: string;
      panNumber?: string;
      isIdentityVerified?: boolean;
      city?: string;
    },
  ): Promise<EmployeeItem> {
    const res = await apiClient.put<EmployeeItem>(`/employees/${encodeURIComponent(resourceId)}`, data);
    return res.data;
  },

  async deleteEmployee(resourceId: string): Promise<{ message: string }> {
    const res = await apiClient.delete<{ message: string }>(`/employees/${encodeURIComponent(resourceId)}`);
    return res.data;
  },
};

export default masterService;
