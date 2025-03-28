import img1 from '../assets/products/image 23.png'
import img2 from '../assets/products/Frame 129.png'
import Cont5 from './Home/cont5'
import Cont6 from './Home/cont6'
import ConstForm from './contForm'

const Fresher = () => {
    const list = [
        {
            image: img2,
            name: 'Registration',
            para: 'Prospective recruiters can join the platform  by selecting either "Join as Job Consulting Firm" or "Join as Freelance Recruiter,"'
        },
        {
            image: img2,
            name: 'Profile Completion',
            para: 'Prospective recruiters can join the platform by selecting either "Join as Job Consulting Firm" or "Join as Freelance Recruiter,"'
        },
        {
            image: img2,
            name: 'Access to Opportunities',
            para: 'Prospective recruiters can join the platform by selecting either "Join as Job Consulting Firm" or "Join as Freelance Recruiter,"'
        },
        {
            image: img2,
            name: 'Candidate Sourcing',
            para: 'Prospective recruiters can join the platform by selecting either "Join as Job Consulting Firm" or "Join as Freelance Recruiter,"'
        },
        {
            image: img2,
            name: 'Placement and Compensation',
            para: 'Prospective recruiters can join the platform by selecting either "Join as Job Consulting Firm" or "Join as Freelance Recruiter,"'
        },
        {
            image: img2,
            name: 'Placement and Compensation',
            para: 'Prospective recruiters can join the platform by selecting either "Join as Job Consulting Firm" or "Join as Freelance Recruiter,"'
        },
    ]
    return (
        <>
            <div className='flex flex-col lg:flex-row bg-gray-100 px-4 py-10 '>
                <div className='lg:w-1/2 lg:ml-20' >
                    <h1 className='text-2xl font-semibold'>
                        Assured Job started as a simple idea: to make job <br /> searching stress-free and recruitment faster.
                    </h1>
                    <p className='mt-6'>
                        The world of job hunting and hiring can feel overwhelming. We’re here to change that. Whether you’re just
                        starting your career or looking for your next big break, Assured Job simplifies the process so you can be
                        confident in your career journey.
                    </p>
                    <button className='bg-purple-600 text-white py-2 px-8 rounded mt-4'>
                        HR Freelancer
                    </button>
                </div>
                <div className='lg:w-1/2 mt-5 lg:mt-0 lg:me-10'>
                    <img src={img1} alt='Image' className='w-full' />
                </div>
            </div>

            <div>
                <div className='text-center mt-10'>
                <span className='bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full'>How it Work</span>
                    <p className='text-purple-600 mt-4'>
                        Our complete assistance will be with you and we guide you accordingly.
                    </p>
                </div>
            </div>

            <div className="mx-4 lg:mx-10 mt-10">
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {list.map((box, index) => (
                        <div key={index} className='bg-white shadow-xl rounded-xl p-6'>
                            <img src={box.image} alt='' className='h-12' />
                            <h1 className='text-xl font-semibold mt-4'>{box.name}</h1>
                            <p className='text-sm text-black mt-4'>{box.para}</p>
                        </div>
                    ))}
                </div>
            </div>
            <Cont5/>
            <ConstForm/>
            <Cont6/>
        </>
    )
}

export default Fresher;
