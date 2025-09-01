"use client"
import React, { useState } from 'react'
import { FaFacebookF } from "react-icons/fa";
import { IoLogoTwitter } from "react-icons/io5";
import { FiInstagram } from "react-icons/fi";
import { FaYoutube } from "react-icons/fa";
import { FaPinterestP } from "react-icons/fa";
import Link from 'next/link';


const Footer = ({ items }: { items: any }) => {

    // const [active, setActive] = useState("details");
    const [menuOpen, setMenuOpen] = useState(false);

    const shortText = `
    <p>Welcome to the House of Dhaneri, a world of fashion where traditions are fused with modern aesthetics and infused with an ultra-modern spirit to cater to the women of today. It is an authentic fashion brand quintessentially dedicated to Indian ethnic wear. We like to call ourselves a pioneer in prêt modern-ethnic wear, trying to make Indian fashion approachable and affordable to all by eliminating the meticulous hopping between shops and pain-staking efforts.</p>
  `;
    const items1 = [
        "Indian Jewelry", "Women Bags", "Ladies Footwear",
        "Women Belts", "Necklace", "Rings", "Bangles"
    ];

    const items2 = [
        "Indo-Western Dresses", "Kurtis", "Designer Blouse", "Indian Wedding Dresses",
        "Palazzo Pants", "Ethnic Wear", "Pre Stitched Sarees", "Ready to Wear Dresses",
        "Bottoms", "Dupattas", "Bridal Kalire", "Ethnic Tops", "Lounge Wear", "Crop Tops",
        "Girls Wear", "Kids Lehengas", "Kids Sarees", "Reception Wear", "Engagement Wear",
        "Fusion Wear", "Anarkali Dress", "Sharara Sets", "Pakistani Suits",
        "Hand Embroidered Dresses", "Kurta Sets"
    ];

    return (
        <>
            <div className='main bg-gray-100 mt-[30px]'>
                <div className="max-w-screen-xxl mx-auto px-[30px] py-[15px]">

                    {/* <img className='w-full pr-[15%] m-[15px] border-b border-b-[#ededed]' src="./assets/img/footerlogo.png" alt="footer img" /> */}

                    {/* about us */}
                    <div className="flex py-[15px] border-b border-b-[#ededed]">
                        <div className="border-r border-r-[#ededed] w-[20%]">
                            <h3 className='text-[16px] font-bold pb-[10px] uppercase'>Company</h3>
                            <ul>
                                <li><a href="#" className="hover:underline">About Us</a></li>
                                <li><a href="#" className="hover:underline">News and Press</a></li>
                                <li><a href="#" className="hover:underline">Careers</a></li>
                                <li><a href="#" className="hover:underline">Contact Us</a></li>
                                <li><a href="#" className="hover:underline">Wedding Planning</a></li>
                                <li><a href="#" className="hover:underline">2025 Wedding Wardrobe Guide</a></li>
                                <li><a href="#" className="hover:underline">Affiliate Success Guide</a></li>
                            </ul>
                        </div>

                        <div className="border-r border-r-[#ededed] w-[40%]">
                            <h3 className='flex justify-center text-[16px] font-bold pb-[10px] uppercase'>HELP</h3>
                            <div className="flex justify-center">
                                <ul className='px-[10px]'>
                                    <li><a href="#" className="hover:underline">International FAQs</a></li>
                                    <li className="hover:underline"><Link href="/status">Order Status</Link> </li>
                                    <li className="hover:underline"><Link href="/return-policy">Returns & Exchange</Link> </li>
                                    <li className="hover:underline"><Link href="/terms-condition">Terms And Conditions</Link> </li>
                                    <li className="hover:underline"> <Link href="/privacy-policy">Privacy Policy</Link></li>
                                    <li><a href="#" className="hover:underline">Investor Relations</a></li>
                                    <li><a href="#" className="hover:underline">Responsible Disclosure Policy</a></li>
                                </ul>
                                <ul className='px-[10px]'>
                                    <li className="hover:underline"> <Link href="/FAQs">FAQs</Link></li>
                                    <li><a href="#" className="hover:underline">Cancellation policy</a></li>
                                    <li><a href="#" className="hover:underline">Shipping Policy</a></li>
                                    <li><a href="#" className="hover:underline">Ordering & Payment</a></li>
                                    <li><a href="#" className="hover:underline">Size Guide</a></li>
                                    <li><a href="#" className="hover:underline">Wholesale Enquiry</a></li>
                                    <li><a href="#" className="hover:underline">Lookbooks</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-r border-r-[#ededed] w-[40%] px-[70px]">
                            <div className="sighnup">
                                <h3 className='flex justify-center text-[16px] font-bold pb-[10px] uppercase'>Newsletter Signup</h3>
                                <div className="flex justify-center">
                                    <input className='bg-[#fff] border text-[#b0b0b0] p-[10px]  outline' type="text" placeholder='Enter Email Address' />
                                    <button className='uppercase bg-[#000] text-[#fff] px-[10px]'>Subscribe</button>
                                </div>
                            </div>
                            <div className='pt-[25px]'>
                                <h3 className='flex justify-center text-[16px] font-bold pb-[10px] uppercase'>Connect With Us</h3>
                                <div className="flex justify-center py-[5px]">
                                    <FaFacebookF className='m-[10px] border rounded-full p-[5px]' size={25} />
                                    <IoLogoTwitter className='m-[10px]  border rounded-full  p-[5px]' size={25} />
                                    <FiInstagram className='m-[10px]  border rounded-full  p-[5px]' size={25} />
                                    <FaYoutube className='m-[10px]  border rounded-full  p-[5px]' size={25} />
                                    <FaPinterestP className='m-[10px]  border rounded-full  p-[5px]' size={25} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* address and payment */}
                    <div className="flex py-[15px] border-b border-b-[#ededed]">
                        <div className="border-r border-r-[#ededed] w-[40%] py-[15px]">
                            <h2 className='text-[16px] font-bold py-[20px] uppercase'>In case of any concern, Contact Us</h2>
                            <h2 className='text-[16px] font-bold uppercase'>Head Office Address:</h2>
                            <p>High Street Essentials Pvt Ltd <br />
                                C-39, C Block, Sector 58, Noida, <br />
                                Uttar Pradesh - 201301, India <br />
                                Customer Care: +91-8929987349 </p>
                            <p className='pt-[20px]'>Due to high call volumes, we're currently unavailable on calls. For a quicker resolution, please reach out to us directly on WhatsApp! </p>
                        </div>
                        <div className="border-r border-r-[#ededed] w-[30%] p-[40px]">

                            <h2 className=' flex text-[16px] font-bold pl-[0px] uppercase'>Return Address:</h2>
                            <p className=''>High Street Essentials Pvt Ltd <br />
                                Plot No-39, Block-C, Sector-58, <br />
                                Noida, Uttar Pradesh - 201301, India </p>

                        </div>
                        <div className="border-r border-r-[#ededed] w-[30%] p-[40px]">
                            <h2 className='text-[16px] font-bold uppercase px-[15px]'>Payment Methods</h2>
                            <img className='w-full p-[10px]' src="/assets/img/payment.png" alt="payment" />
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Footer