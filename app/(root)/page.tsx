import React from 'react'
import HeaderBox from '@/components/headerBox';

const Home = () => {
    return(
        <section className='home'>
            <div className='home-content'>
                <header className='home-header'>
                    <HeaderBox />
                </header>
            </div>
        </section>
    )
}

export default Home;