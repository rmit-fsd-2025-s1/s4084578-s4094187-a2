import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Tutor } from './entity/Tutor';
import { Lecturer } from './entity/Lecturer';
import { Course } from './entity/Course';
import { Tutor_Application } from './entity/Tutor_Application';
import { Lecturer_Course } from './entity/Lecturer_Course';

export const TestDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  entities: [Tutor, Lecturer, Course, Tutor_Application, Lecturer_Course],
  logging: false,
});
