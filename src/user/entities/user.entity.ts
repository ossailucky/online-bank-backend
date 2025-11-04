import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum AccountType {
    SAVINGS= 'savings',
    CURRENT = 'current',
    BUSINESS = 'business',
    //JOINT = 'joint',
  }

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true})
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column()
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

    @Column({
        type: String,
        default: AccountType.SAVINGS,
    })
    accountType: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({type: Number, default: null})
  resetPasswordToken: number;
  
  @Column({type: Date, default: null})
  resetPasswordExpires: Date;

  @Column({type: String, nullable: false})
  gender: string;

  @Column({type: String, nullable: false})
  country: string;

  @Column({ type: String, nullable:true})
  profilePicture: string;

  @Column({ type: String, nullable:true})
  bio: string;


  @Column({ type: 'decimal', precision: 10, scale: 2, default:0})
  accountBalance: number;

   //Reference NFTs owned by this user
//   @OneToMany(() => NFT,(nft) => nft.owner)
//   ownednfts: NFT[];
 
//   @OneToMany(() => NFT, (nft) => nft.creator)
//   nfts: NFT[];

//   @OneToMany(() => Deposit, (deposit) => deposit.user)
//   deposits: Deposit[];

//   @OneToMany(() => Withdraw, (withdrawal) => withdrawal.user)
//   withdrawals: Withdraw[];

//   @OneToMany(() => Transaction, (transanction) => transanction.user)
//   transactions: Transaction[];

//   @OneToMany(() => Notification, (notification) => notification.recipient)
//   notifications: Notification[];

//   @ManyToMany(() => Loan, (loans) => loans.copiers)
//   loans: Loan[];




//   @OneToMany(() => TradingConfiguration, tradingConfiguration=> tradingConfiguration.user)
//   tradingBots: TradingConfiguration[];


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}