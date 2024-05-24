import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { BaseEntity, Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 100,
    comment: '사용자 이메일',
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요' })
  email: string;

  @Column({ type: 'varchar', length: 10, comment: '사용자 이름' })
  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요' })
  @Matches(/^[가-힣a-zA-Z]{2,10}$/, {
    message: '이름은 한글, 영문 2~10자로 입력해주세요',
  })
  username: string;

  @Column({ type: 'varchar', length: 20, comment: '사용자 닉네임' })
  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요' })
  @Matches(/^[가-힣a-zA-Z0-9]{2,20}$/, {
    message: '닉네임은 한글, 영문, 숫자 2~20자로 입력해주세요',
  })
  nickname: string;

  @Column({ type: 'varchar', comment: '사용자 비빌번호' })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  @Matches(
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
    {
      message:
        '비밀번호는 영문 대소문자, 숫자, 특수문자를 포함한 8~20자로 입력해주세요',
    },
  )
  password: string;

  @Column({ type: 'varchar', length: 20, comment: '사용자 전화번호' })
  @IsString()
  @IsNotEmpty({ message: '전화번호를 입력해주세요' })
  @Matches(/^\d{3}-\d{3,4}-\d{4}$/, {
    message: '전화번호 형식에 맞게 입력해주세요',
  })
  phoneNumber: string;

  @Column({ type: 'text', comment: '사용자 프로필 이미지', nullable: true })
  profileImage?: string;

  @Column({ type: 'varchar', comment: '사용자 token' })
  token: string;

  @Column({ type: 'varchar', length: 100, comment: '사용자 소개글' })
  introduction: string;
}
