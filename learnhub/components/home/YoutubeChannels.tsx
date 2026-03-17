'use client'
import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react'

const CHANNELS = [
  {
    name: 'Apna College',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mGDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@ApnaCollegeOfficial/playlists',
    courses: [
      { title: 'Java + DSA Full Course', vid: 'yRpLlJmRo2w' },
      { title: 'Web Dev Bootcamp', vid: 'tVzUXW6siu0' },
      { title: 'SQL Full Course', vid: 'hlGoQC332VM' },
    ],
  },
  {
    name: 'CodeWithHarry',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nGDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@CodeWithHarry/playlists',
    courses: [
      { title: 'Python Tutorial Hindi', vid: 'gfDE2a7MKjA' },
      { title: 'C++ Full Course', vid: 'j8nAHeVKL08' },
      { title: 'Django Tutorial', vid: 'oU9kNIOlHMY' },
    ],
  },
  {
    name: 'CodeHelp - by Babbar',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mADFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@CodeHelp/playlists',
    courses: [
      { title: 'DSA Supreme', vid: 'WQoB2z67hvY' },
      { title: 'C++ STL Course', vid: 'RRVYpIET_RQ' },
      { title: 'DBMS Full Course', vid: 'kBdlM6hNDAE' },
    ],
  },
  {
    name: 'Love Babbar',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mBDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@LoveBabbar/playlists',
    courses: [
      { title: '450 DSA Sheet', vid: 'WQoB2z67hvY' },
      { title: 'C++ Full Course', vid: 'j8nAHeVKL08' },
      { title: 'OS Full Course', vid: 'vBURTt97EkA' },
    ],
  },
  {
    name: 'Kunal Kushwaha',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mCDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@KunalKushwaha/playlists',
    courses: [
      { title: 'DSA in Java', vid: '6iF8Xb7Z3wQ' },
      { title: 'DevOps Bootcamp', vid: 'ZbZSfleFcuU' },
      { title: 'Open Source', vid: 'msyGybzroXY' },
    ],
  },
  {
    name: 'Striver (take U forward)',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mDDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@takeUforward/playlists',
    courses: [
      { title: 'A2Z DSA Course', vid: '0bHoB32fuj0' },
      { title: 'Graph Series', vid: 'YTtpfjkEwe8' },
      { title: 'DP Series', vid: 'FfXoiwwnxFw' },
    ],
  },
  {
    name: 'Harkirat Singh',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mEDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@harkirat.singh/playlists',
    courses: [
      { title: '100xDevs Cohort', vid: 'LFbHRzPBKBs' },
      { title: 'Web3 Bootcamp', vid: 'ERAxAHuqMDQ' },
      { title: 'TypeScript Course', vid: 'AQX2R_-qlzQ' },
    ],
  },
  {
    name: 'Piyush Garg',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mFDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@piyushgargdev/playlists',
    courses: [
      { title: 'Node.js Full Course', vid: 'rg7Fvvl3taU' },
      { title: 'Docker & Kubernetes', vid: 'rOTqprHv1YE' },
      { title: 'Next.js Tutorial', vid: 'ZVnjOPwW4ZA' },
    ],
  },
  {
    name: 'Thapa Technical',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mGGFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@ThapaTechnical/playlists',
    courses: [
      { title: 'MERN Stack Course', vid: 'GHTA143_b-s' },
      { title: 'React JS Tutorial', vid: 'RGKi6LSPDLU' },
      { title: 'JavaScript Hindi', vid: 'ER9SspLe4Hg' },
    ],
  },
  {
    name: 'Geeky Shows',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mHDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@GeekyShows/playlists',
    courses: [
      { title: 'Django Full Course', vid: 'oU9kNIOlHMY' },
      { title: 'Python OOP', vid: 'qiSCMNBIP2g' },
      { title: 'Flask Tutorial', vid: 'Z1RJmh_OqeA' },
    ],
  },
  {
    name: 'WsCube Tech',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mIDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@wscubetech/playlists',
    courses: [
      { title: 'Digital Marketing', vid: 'nU-IIXBWlS4' },
      { title: 'JavaScript Full', vid: 'ER9SspLe4Hg' },
      { title: 'React Tutorial', vid: 'RGKi6LSPDLU' },
    ],
  },
  {
    name: 'Intellipaat',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mJDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@Intellipaat/playlists',
    courses: [
      { title: 'AWS Full Course', vid: 'k1RI5locZE4' },
      { title: 'Data Science Course', vid: 'JL_grPUnXzY' },
      { title: 'DevOps Tutorial', vid: 'lpk7VpGqkKw' },
    ],
  },
  {
    name: 'Simplilearn',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mKDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@SimplilearnOfficial/playlists',
    courses: [
      { title: 'Machine Learning', vid: 'ukzFI9rgwfU' },
      { title: 'Cyber Security', vid: 'nzZkKoREEGo' },
      { title: 'PMP Certification', vid: 'uWPIsaYpY7U' },
    ],
  },
  {
    name: 'Great Learning',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mLDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@GreatLearning/playlists',
    courses: [
      { title: 'AI & ML Course', vid: 'JMUxmLyrhSk' },
      { title: 'Cloud Computing', vid: 'M988_fsOSWo' },
      { title: 'Data Analytics', vid: 'ua-CiDNNj30' },
    ],
  },
  {
    name: 'Scaler',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mMDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@ScalerAcademy/playlists',
    courses: [
      { title: 'System Design', vid: 'FSR1re0pZpY' },
      { title: 'DSA Masterclass', vid: 'WQoB2z67hvY' },
      { title: 'Backend Dev', vid: 'rg7Fvvl3taU' },
    ],
  },
  {
    name: 'Coding Ninjas',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mNDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@CodingNinjas/playlists',
    courses: [
      { title: 'C++ Beginners', vid: 'j8nAHeVKL08' },
      { title: 'Java Bootcamp', vid: 'yRpLlJmRo2w' },
      { title: 'Interview Prep', vid: '0bHoB32fuj0' },
    ],
  },
  {
    name: 'Edureka',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mODFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@edurekaIN/playlists',
    courses: [
      { title: 'Python Full Course', vid: 'WGJJIrtnfpk' },
      { title: 'Kubernetes Tutorial', vid: 'rOTqprHv1YE' },
      { title: 'Tableau Training', vid: 'aHaOIvR00So' },
    ],
  },
  {
    name: 'Unacademy CS',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mPDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@unacademy/playlists',
    courses: [
      { title: 'GATE CS 2024', vid: 'xw_OuOhjauw' },
      { title: 'OS Concepts', vid: 'vBURTt97EkA' },
      { title: 'CN Full Course', vid: 'qiSCMNBIP2g' },
    ],
  },
  {
    name: 'Physics Wallah Skills',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mQDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@PhysicsWallah/playlists',
    courses: [
      { title: 'Full Stack Dev', vid: 'GHTA143_b-s' },
      { title: 'Data Science', vid: 'JL_grPUnXzY' },
      { title: 'Python Basics', vid: 'gfDE2a7MKjA' },
    ],
  },
  {
    name: 'PW Skills',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mRDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@pwskills/playlists',
    courses: [
      { title: 'MERN Stack', vid: 'GHTA143_b-s' },
      { title: 'Java DSA', vid: 'yRpLlJmRo2w' },
      { title: 'React Course', vid: 'RGKi6LSPDLU' },
    ],
  },
  {
    name: 'NPTEL',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mSDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@iit/playlists',
    courses: [
      { title: 'Algorithms IIT', vid: 'xw_OuOhjauw' },
      { title: 'ML by IIT Madras', vid: 'JMUxmLyrhSk' },
      { title: 'DBMS IIT', vid: 'kBdlM6hNDAE' },
    ],
  },
  {
    name: 'freeCodeCamp Hindi',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mTDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@freecodecamp/playlists',
    courses: [
      { title: 'HTML & CSS Full', vid: 'mU6anWqZJcc' },
      { title: 'JavaScript Full', vid: 'PkZNo7MFNFg' },
      { title: 'Python Beginner', vid: 'rfscVS0vtbw' },
    ],
  },
  {
    name: 'TechTFQ',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mUDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@techTFQ/playlists',
    courses: [
      { title: 'SQL for Beginners', vid: 'hlGoQC332VM' },
      { title: 'Python & SQL', vid: 'gfDE2a7MKjA' },
      { title: 'Data Engineering', vid: 'ua-CiDNNj30' },
    ],
  },
  {
    name: "Jenny's Lectures CS/IT",
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mVDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@JennyslecturesCSIT/playlists',
    courses: [
      { title: 'C Programming', vid: 'irqbmMNs2Bo' },
      { title: 'Data Structures', vid: 'AT14lCXuMKI' },
      { title: 'Algorithms', vid: 'xw_OuOhjauw' },
    ],
  },
  {
    name: 'Knowledge Gate',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mWDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@Knowledgegate/playlists',
    courses: [
      { title: 'GATE CS Prep', vid: 'xw_OuOhjauw' },
      { title: 'OS Full Course', vid: 'vBURTt97EkA' },
      { title: 'TOC Course', vid: 'qiSCMNBIP2g' },
    ],
  },
  {
    name: 'Gate Smashers',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mXDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@GateSmashers/playlists',
    courses: [
      { title: 'DBMS Full Course', vid: 'kBdlM6hNDAE' },
      { title: 'CN Full Course', vid: 'qiSCMNBIP2g' },
      { title: 'OS Full Course', vid: 'vBURTt97EkA' },
    ],
  },
  {
    name: 'MySirG.com',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mYDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@MySirG/playlists',
    courses: [
      { title: 'C Language Hindi', vid: 'irqbmMNs2Bo' },
      { title: 'Java Hindi', vid: 'yRpLlJmRo2w' },
      { title: 'Python Hindi', vid: 'gfDE2a7MKjA' },
    ],
  },
  {
    name: 'Code Step By Step',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mZDFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@Codestepbystep/playlists',
    courses: [
      { title: 'Java Full Course', vid: 'yRpLlJmRo2w' },
      { title: 'DSA Java', vid: 'AT14lCXuMKI' },
      { title: 'Spring Boot', vid: 'vtPkZShrvXQ' },
    ],
  },
  {
    name: 'Geeky Codes',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_maAFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@GeekyCodes/playlists',
    courses: [
      { title: 'React Full Course', vid: 'RGKi6LSPDLU' },
      { title: 'Node.js Course', vid: 'rg7Fvvl3taU' },
      { title: 'MongoDB Tutorial', vid: 'ExcRbA7fy_A' },
    ],
  },
  {
    name: 'CodeHelp Hindi',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_mbAFqKMFKFt4OhMFMFMFMFMFMFMFMFMFMFMFMFMF=s88',
    url: 'https://www.youtube.com/@CodeHelpHindi/playlists',
    courses: [
      { title: 'C++ Hindi', vid: 'j8nAHeVKL08' },
      { title: 'DSA Hindi', vid: 'WQoB2z67hvY' },
      { title: 'Web Dev Hindi', vid: 'tVzUXW6siu0' },
    ],
  },
]

function ChannelCard({ channel }: { channel: typeof CHANNELS[0] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -220 : 220, behavior: 'smooth' })
  }

  return (
    <div className="bg-white rounded-xl border border-surface-200 p-4 min-w-[320px] w-[320px] shadow-sm hover:shadow-md transition-shadow">
      {/* Channel Header */}
      <a href={channel.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 mb-4 group">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img
            src={`https://i.ytimg.com/vi/${channel.courses[0].vid}/default.jpg`}
            alt={channel.name}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm text-[#1c1d1f] truncate group-hover:text-red-600 transition-colors">{channel.name}</p>
          <p className="text-xs text-surface-400">YouTube • Free Courses</p>
        </div>
        <span className="ml-auto text-red-500 flex-shrink-0">▶</span>
      </a>

      {/* Course Thumbnails */}
      <div className="relative">
        <button onClick={() => scroll('left')} className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white border border-surface-200 rounded-full flex items-center justify-center shadow text-xs hover:bg-surface-50">‹</button>
        <button onClick={() => scroll('right')} className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white border border-surface-200 rounded-full flex items-center justify-center shadow text-xs hover:bg-surface-50">›</button>
        <div ref={scrollRef} className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {channel.courses.map((course) => (
            <a
              key={course.vid}
              href={`https://www.youtube.com/watch?v=${course.vid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-[130px] group/card"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden bg-surface-100 mb-1">
                <img
                  src={`https://i.ytimg.com/vi/${course.vid}/mqdefault.jpg`}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                  <PlayCircle className="w-8 h-8 text-white drop-shadow" />
                </div>
              </div>
              <p className="text-[11px] text-[#1c1d1f] font-medium line-clamp-2 leading-tight">{course.title}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function YoutubeChannels() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeft(scrollLeft > 0)
    setShowRight(scrollLeft < scrollWidth - clientWidth - 5)
  }

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -700 : 700, behavior: 'smooth' })
  }

  return (
    <section className="py-12 bg-[#f7f8fa] border-t border-surface-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">▶️</span>
          <div>
            <h2 className="text-2xl font-bold text-[#1c1d1f]">Free YouTube Courses</h2>
            <p className="text-sm text-surface-500 mt-0.5">Top Indian educators • Watch directly on YouTube</p>
          </div>
        </div>

        <div className="relative">
          {showLeft && (
            <button onClick={() => scroll('left')} className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-surface-200 shadow-xl flex items-center justify-center hover:bg-surface-50 transition-all active:scale-90">
              <ChevronLeft className="h-6 w-6 text-[#1c1d1f]" />
            </button>
          )}
          {showRight && (
            <button onClick={() => scroll('right')} className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-surface-200 shadow-xl flex items-center justify-center hover:bg-surface-50 transition-all active:scale-90">
              <ChevronRight className="h-6 w-6 text-[#1c1d1f]" />
            </button>
          )}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2"
          >
            {CHANNELS.map((channel) => (
              <ChannelCard key={channel.name} channel={channel} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
