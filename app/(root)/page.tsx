import React from 'react'
import HeaderBox from '@/components/headerBox';
import TotalBalanceBox from '@/components/totalBalanceBox';
import RightSidebar from '@/components/rightSidebar';

const Home = () => {
    const loggedIn = { firstName: 'Hollali',  lastName:'Kelvin', email:'Hollali@socialsurge.pro'}
    return(
        <section className='home'>
            <div className='home-content'>
                <header className='home-header'>
                    <HeaderBox 
                    type="greeting"
                    title="Welcome"
                    user={loggedIn?.firstName || 'Guest' }
                    subtext="Access and manage your account 
                    and transactions efficiently"/>
                    <TotalBalanceBox
                    accounts={[]}
                    totalBanks={1}
                    totalCurrentBalance={1250.35}/>
                </header>
                RECENT TRANSACTIONS
            </div>
            <RightSidebar
            user={loggedIn}
            transaction={[]}
            banks={[{},{}]}
            />
        </section>
    )
}

export default Home;