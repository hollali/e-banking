import React from 'react'
import AnimatedCounter from './animatedCounter'
import { formatAmount } from '@/lib/utils'
import CountUp from 'react-countup'
const TotalBalanceBox = ({
    accounts=[], totalBanks, totalCurrentBalance
}:TotlaBalanceBoxProps) => {
    
  return (
    <section className='total-balance'>
        <div className='total-balance-chart'>
            {/**  DoughnutChart **/}
        </div>
        <div className='flex flex-col gap-6'>
            <h2 className='header-2'>
                Bank Accounts: {totalBanks} 
            </h2>
            <div className='flex flex-col gap-2'>
                <span className='total-balance-label'>
                    Total Current Balance
                </span>

                <div className='total-balance-amount flex-center gap-2'>
                    <AnimatedCounter amount=
                    {totalCurrentBalance}/>
                </div>
            </div>
        </div>
    </section>
  )
}

export default TotalBalanceBox