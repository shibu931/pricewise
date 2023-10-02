'use client'
import { scrapeAndStoreProduct } from '@/lib/actions';
import React, { FormEvent, useState } from 'react'

export default function SearchBar() {
    const [searchPrompt,setSearchPrompt] = useState('');
    const [isLoading,setIsLoading] = useState(false)
    const isValidAmazonProductLink =(url:string)=>{
      try {
        const parsedURL = new URL(url);
        const hostname = parsedURL.hostname;
        if(hostname.includes('amazon.com') ||
         hostname.includes('amazon.') ||
        hostname.endsWith('amazon')){
          return true
        }
        return false;
      } catch (error) {
        return false;        
      }
    }
    const handleSubmit =async (event: FormEvent<HTMLFormElement>)=>{
      event.preventDefault();
      const isValidLink = isValidAmazonProductLink(searchPrompt)
      if(!isValidLink) return alert("Please provide a valid Amazon Link")
      try {
        setIsLoading(true)
        //Scrape the product page
        const product  = await scrapeAndStoreProduct(searchPrompt);
        
      } catch (error) {
        console.log(error)
      }finally{
        setIsLoading(false)
      }
    }
  return (
    <form action="" className='flex flex-wrap gap-4 mt-12' onSubmit={handleSubmit}> 
    <input type="text"
        value={searchPrompt}
        onChange={(e)=>setSearchPrompt(e.target.value)}
        placeholder='Enter product Link'
        className='searchbar-input'
    />
    <button
    disabled={searchPrompt ===''}
    type='submit' className='searchbar-btn'>
      {isLoading ? 'Searching...':'Search'}
    </button>
    </form>
  )
}
