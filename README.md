***TỔNG KẾT:
  - Hoàn thành hết các yêu cầu (API) của ứng dung Trung Tâm Đào Tạo
  - Sử dụng Postman để test API
  - Phân tích thiết kế CSDL postgres, mối quan hệ 1-n, n-1, n-n
  - Sử dụng Debug để fix các bug khi tính toán
***

B1: Mô hình các thực thể:

  Bảng nhan_vien (Employee)
    id: Primary Key
    ten: Tên nhân viên
    chuc_vu: Chức vụ (Quản lý, Giáo viên)
    quan_ly_id: Foreign Key tự tham chiếu đến chính bảng nhan_vien (Mỗi nhân viên có một quản lý)
    luong_moi_gio: Mức lương mỗi giờ
    
  Bảng chuong_trinh_dao_tao (TrainingProgram)
    id: Primary Key
    ten: Tên chương trình
    nhan_vien_id: Foreign Key tham chiếu đến bảng nhan_vien (Mỗi chương trình do một nhân viên quản lý)

  Bảng mon_hoc (Subject)
    id: Primary Key
    ten: Tên môn học (Unique trong từng chương trình đào tạo)
    so_gio: Số giờ của môn học
    chuong_trinh_dao_tao_id: Foreign Key tham chiếu đến bảng chuong_trinh_dao_tao
    
  Bảng hoc_vien (Student)
    id: Primary Key
    ten: Tên học viên
    ngay_sinh: Ngày sinh
    
  Bảng hoc_vien_chuong_trinh (TraniningProgram)
    hoc_vien_id: Foreign Key tham chiếu đến bảng hoc_vien
    chuong_trinh_dao_tao_id: Foreign Key tham chiếu đến bảng chuong_trinh_dao_tao
    (Mỗi học viên có thể tham gia nhiều chương trình đào tạo)
    
  Bảng hoc_vien_mon_hoc (StudentSubject)
    hoc_vien_id: Foreign Key tham chiếu đến bảng hoc_vien
    mon_hoc_id: Foreign Key tham chiếu đến bảng mon_hoc
    diem: Điểm của học viên cho môn học
    
  Bảng buoi_hoc (ClassSession)
    id: Primary Key
    mon_hoc_id: Foreign Key tham chiếu đến bảng mon_hoc
    phong_hoc_id: Foreign Key tham chiếu đến bảng phong_hoc
    thoi_gian: Thời gian buổi học (2 giờ)
    
  Bảng giao_vien_mon_hoc (SubjectTeacher)
    giao_vien_id: Foreign Key tham chiếu đến bảng nhan_vien
    mon_hoc_id: Foreign Key tham chiếu đến bảng mon_hoc
    vai_tro: Vai trò của giáo viên ("giang_vien" hoặc "tro_giang")
    
  Bảng phong_hoc (Classroom)
    id: Primary Key
    ten: Tên phòng học

B2: Sử dụng PostgreSQL làm cơ sở dữ liệu
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'password',
            database: 'DB_QLTTDT',
            entities: [
                Employee,
                ...
            ],
            synchronize: true,
    }),
    EmployeeModule,
    ...
  ],

B3: sử dụng package node-postgres để kết nối đến cơ sở dữ liệu và thực hiện các query SQL
  // src/database.provider.ts
  import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
  import { Pool } from 'pg';

  @Injectable()
  export class DatabaseProvider implements OnModuleInit, OnModuleDestroy {
      private pool: Pool;

      onModuleInit() {
          this.pool = new Pool({
              user: "postgres",
              host: 'localhost',
              database: 'DB_QLTTDT',
              password: "password",
              port: 5432,
          });
      }

      onModuleDestroy() {
          this.pool.end();
      }

      getPool() {
          return this.pool;
      }
  }
