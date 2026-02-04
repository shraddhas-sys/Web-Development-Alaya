import React from 'react';
import mainHeroImage from '../assets/images/image.png';
import flowPlannerImage from '../assets/images/image copy.png';
import meditativeJournalImage from '../assets/images/image copy 3.png';
import alayaLogo from '../assets/images/image copy 2.png';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="bg-[#E5E1D8] min-h-screen font-sans text-[#333] selection:bg-[#8B4513] selection:text-white scroll-smooth relative">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#E5E1D8]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-10 md:px-20 py-4">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <img src={alayaLogo} alt="Alaya Logo" className="w-16 h-16 object-contain group-hover:rotate-12 transition-transform duration-500 drop-shadow-sm" />
            <span className="text-xl font-serif tracking-widest font-bold text-[#333] group-hover:text-[#8B4513] transition-colors">ALAYA</span>
          </div>

          <div className="flex items-center gap-6 md:gap-8">
            <nav className="hidden lg:flex items-center gap-6 text-[9px] uppercase tracking-[0.25em] font-bold text-stone-600">
              <a href="#about" className="hover:text-[#8B4513] transition-colors">About Us</a>
              <a href="#classes" className="hover:text-[#8B4513] transition-colors">Classes</a>
              <a href="#features" className="hover:text-[#8B4513] transition-colors">Features</a>
              <a href="#practice" className="hover:text-[#8B4513] transition-colors">Practice</a>
              <a href="#contact" className="hover:text-[#8B4513] transition-colors">Contact</a>
            </nav>

            <button onClick={onGetStarted} className="text-[#8B4513] border border-[#8B4513]/40 px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-[#8B4513] hover:text-white transition-all shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.6)]">
              Sign In
            </button>
          </div>
        </div>
      </header>
      <section className="relative px-6 pt-40 pb-20 max-w-7xl mx-auto flex flex-col md:flex-row items-center min-h-screen">
        <div className="md:w-1/2 md:pr-10">
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#8B4513] mb-4 block">Mindful Planning</span>
          <h1 className="text-5xl md:text-7xl font-serif leading-[1.1] mb-6">
            Find Your Flow, <br /> 
            <span className="italic text-[#8B4513]">Plan Your Peace.</span>
          </h1>
          <p className="text-stone-600 max-w-sm mb-8 leading-relaxed text-lg">
            In a world that demands we move faster, Alaya is a digital invitation to slow down. It is a sacred space for your ritual.
          </p>
          <button onClick={onGetStarted} className="bg-[#C67347] text-white px-10 py-4 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#B05D33] transition shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]">
            Get Started
          </button>
        </div>
        
        <div className="md:w-1/2 w-full mt-12 md:mt-0">
          <div className="relative group">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/30 blur-3xl rounded-full group-hover:bg-[#C67347]/20 transition-colors duration-700"></div>
            <img src={mainHeroImage} className="w-full h-[500px] object-cover rounded-[40px] shadow-2xl relative z-10 transition-transform duration-700 group-hover:scale-[1.01] group-hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]" alt="Yoga Hero" />
          </div>
        </div>
      </section>
      <section id="about" className="px-6 py-24 max-w-6xl mx-auto scroll-mt-20">
        <div className="mb-12 text-left">
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#8B4513]">Our Philosophy</span>
          <h2 className="text-3xl md:text-5xl font-serif leading-[1.1] text-stone-900 mt-2">
            Why <span className="italic text-[#C67347]">Alaya</span> was Created
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { title: "The Alaya Vision", desc: "We believe yoga is more than just movement; it is a way of life. Alaya was built to bridge the gap between modern schedules and ancient mindfulness." },
            { title: "Rooted in Ritual", desc: "Our platform focuses on consistency. By providing tools to plan and track your practice, we help you turn sporadic effort into a sacred ritual." },
            { title: "A Shared Journey", desc: "You are never practicing alone. Alaya connects you with expert teachers and a community that values growth and intentional living." },
          ].map((item, i) => (
            <div key={i} className="bg-white/40 border border-white/60 rounded-[40px] p-10 transition-all duration-500 flex flex-col justify-center min-h-[280px] shadow-sm hover:shadow-[0_0_30px_rgba(255,255,255,0.8)] hover:-translate-y-1 hover:bg-white/80 hover:brightness-105">
              <span className="text-[10px] text-[#C67347] font-bold uppercase tracking-widest mb-4">0{i+1}</span>
              <h3 className="text-xl font-serif text-stone-900 mb-4">{item.title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="classes" className="px-6 py-24 max-w-6xl mx-auto scroll-mt-20">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#8B4513] mb-2 block">Curated Sessions</span>
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900">Our Classes</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { category: "Simple", desc: "Perfect for beginners or those seeking gentle movement.", list: ["Hatha Foundations", "Gentle Flow", "Restorative Stretch"] },
            { category: "Meditate", desc: "Deep focus on breathwork and mental clarity.", list: ["Vipassana Intro", "Yin Yoga Ritual", "Pranayama Breath"] },
            { category: "High Level", desc: "Intense sessions to challenge strength and agility.", list: ["Power Vinyasa", "Ashtanga Series", "Advanced Inversions"] },
          ].map((item, i) => (
            <div key={i} className="bg-white/40 border border-white/60 rounded-[45px] p-10 transition-all duration-500 hover:bg-white/95 hover:shadow-[0_0_40px_rgba(255,255,255,1)] hover:-translate-y-2 hover:brightness-110">
              <h3 className="text-2xl font-serif text-[#8B4513] mb-4">{item.category}</h3>
              <p className="text-xs text-stone-500 mb-8 italic leading-relaxed">{item.desc}</p>
              <ul className="space-y-4">
                {item.list.map((yoga, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-stone-700 font-medium group/item">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C67347] transition-all group-hover/item:shadow-[0_0_12px_#C67347] group-hover/item:scale-125"></span>
                    {yoga}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto scroll-mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          {[
            { title: "Intuitive Flow Planner", desc: "Build your personalized daily ritual with our drag-and-drop sequence builder.", img: flowPlannerImage },
            { title: "Guided Meditative Journals", desc: "Reflect on your physical and emotional journey. Track your progress in mental clarity.", img: meditativeJournalImage }
          ].map((feature, i) => (
            <div key={i} className="group cursor-default">
              <div className="h-96 rounded-[40px] overflow-hidden mb-8 shadow-lg border border-white/20 transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                <img src={feature.img} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 group-hover:brightness-110" alt={feature.title} />
              </div>
              <h3 className="text-2xl font-serif mb-4 transition-colors group-hover:text-[#8B4513]">{feature.title}</h3>
              <p className="text-stone-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="practice" className="py-24 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#F5F2ED] to-[#EBE4D9] rounded-[60px] p-10 md:p-20 shadow-xl border border-white text-center relative overflow-hidden">
          <h2 className="text-4xl md:text-5xl font-serif italic mb-12">Foundation of Practice</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { name: "Vrikshasana", type: "Tree Pose", benefit: "Improves balance." },
              { name: "Adho Mukha", type: "Downward Dog", benefit: "Energizes the body." },
              { name: "Trikonasana", type: "Triangle Pose", benefit: "Stretches the heart." },
              { name: "Balasana", type: "Child's Pose", benefit: "A sanctuary for rest." }
            ].map((asana, i) => (
              <div key={i} className="bg-white/50 backdrop-blur-md p-8 rounded-[35px] border border-white/60 hover:-translate-y-2 transition-all hover:bg-white/90 hover:shadow-[0_0_25px_rgba(255,255,255,0.9)] hover:brightness-105">
                <h4 className="text-lg font-serif italic text-[#C67347] mb-1">{asana.name}</h4>
                <p className="text-[10px] uppercase tracking-widest font-bold mb-4 text-stone-400">{asana.type}</p>
                <p className="text-xs text-stone-500 leading-relaxed">{asana.benefit}</p>
              </div>
            ))}
          </div>
          <button onClick={onGetStarted} className="bg-[#C67347] text-white px-10 py-4 rounded-full text-[10px] uppercase tracking-widest font-bold hover:scale-105 transition-all shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]">
            Curate Your Custom Flow
          </button>
        </div>
      </section>
      <footer id="contact" className="bg-[#3A3732] text-[#E5E1D8] pt-20 pb-12 px-10 md:px-20 mt-20 rounded-t-[60px] scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 text-left">
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#C67347] rounded-full flex items-center justify-center text-white font-serif italic text-2xl">A</div>
                <h2 className="text-3xl font-serif tracking-tight">Alaya Studio</h2>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed max-w-sm font-light">
                Alaya is more than a portal; it is a commitment to your daily ritual. Access your curated flows and stillness in one breath.
              </p>
              <div className="flex gap-4 pt-2">
                {['f', 't', 'p', 'i', 'y'].map((social) => (
                  <div key={social} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] uppercase font-bold hover:bg-[#C67347] transition-all cursor-pointer border border-white/5">
                    {social}
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-3 space-y-6">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#C67347]">Contact</h4>
              <ul className="space-y-4 text-sm text-stone-400 font-light">
                <li className="flex flex-col border-b border-white/5 pb-2">
                  <span className="text-white font-medium">+977 01-34567</span>
                  <span className="text-[10px] opacity-60 uppercase tracking-tighter">Inquiry Line</span>
                </li>
                <li className="flex flex-col border-b border-white/5 pb-2">
                  <span className="text-white font-medium">namaste@alaya.com</span>
                  <span className="text-[10px] opacity-60 uppercase tracking-tighter">Email Sanctuary</span>
                </li>
                <li className="flex flex-col">
                  <span className="text-white font-medium">4517 Kathmandu, NP</span>
                  <span className="text-[10px] opacity-60 uppercase tracking-tighter">Physical Space</span>
                </li>
              </ul>
            </div>
            <div className="md:col-span-4 space-y-6">
              <div className="bg-white/5 p-8 rounded-[40px] border border-white/5">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#C67347] mb-2">Sanctuary Access</h4>
                <p className="text-xs text-stone-400 font-light mb-6">Ready to begin your journey? Join our community today.</p>
                <button 
                  onClick={onGetStarted}
                  className="group flex items-center justify-between bg-white/10 border border-white/10 px-6 py-4 rounded-2xl hover:bg-[#C67347] hover:border-[#C67347] transition-all duration-500 w-full"
                >
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white">Join the Circle</span>
                  <span className="text-[#C67347] group-hover:text-white group-hover:translate-x-2 transition-all text-lg">→</span>
                </button>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-500">
              Copyright © 2026 <span className="text-[#C67347]">Alaya Studio</span>. All Rights Reserved.
            </p>
            <div className="flex gap-8 text-[9px] uppercase tracking-widest font-bold text-stone-500">
              <span className="hover:text-white cursor-pointer transition-colors">User Terms</span>
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;