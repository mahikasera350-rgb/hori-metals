'use client';
import {motion} from 'framer-motion';
export function FadeUp({children,className='' ,delay=0}:{children:React.ReactNode;className?:string;delay?:number}){return <motion.div className={className} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.45,delay,ease:[.2,.8,.2,1]}}>{children}</motion.div>}
