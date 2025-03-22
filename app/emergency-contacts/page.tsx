'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaArrowLeft, FaExternalLinkAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

const emergencyContacts = [
  {
    state: 'National Emergency Response Center',
    inCharge: 'Shri Praveen Kumar',
    contact: ['011-23438252', '011-23438253', '011-1070'],
    email: 'dresponse-nerc@gov.in',
    website: 'https://ndmindia.mha.gov.in',
    timings: '24x7',
  },
  {
    state: 'Ministry of Railways',
    inCharge: 'Shri Suresh Kumar',
    contact: ['+91-23382638', '9717641291'],
    email: 'safetycontrolrb@gmail.com',
    website: 'https://indianrailways.gov.in/index1.html',
    timings: '24x7',
  },
  {
    state: 'Andaman & Nicobar Island',
    inCharge: 'Sh. T.K. Ajayan',
    contact: ['9434280357', '9434269884', '03192-238880'],
    email: 'statecontrolroom@gmail.com',
    website: 'https://ddm.and.nic.in/',
    timings: '24x7',
  },
  {
    state: 'Andhra Pradesh',
    inCharge: 'Shri Shanti Swroop',
    contact: ['08645-246600', '8333905033', '0863-2377119'],
    email: 'seoc-apsdma@ap.gov.in',
    website: 'http://apsdma.ap.gov.in/',
    timings: '24x6 (Mon to Sat)',
  },
  {
    state: 'Arunachal Pradesh',
    inCharge: 'Mr. Beru Dulom, Shri Komkar Dulom, Shri Papang Dugguong',
    contact: ['+91-9436227520', '+91-7002657604', '+91-9436074396', '+91-8132887868', '+91-8257891310'],
    email: 'arun01ddm@gmail.com',
    website: 'https://itanagar.nic.in/disaster-management/',
    timings: '24x7',
  },
  {
    state: 'Assam',
    inCharge: 'Dr. Kripal Jyoti Majumdar',
    contact: ['+91-361-2237219', '+91-361-2237377', '+91-9401044617', '+91-9435592762'],
    email: ['sdma-assam@gov.in', 'statedmcontrolroomassam@gmail.com'],
    website: 'https://asdma.assam.gov.in/',
    timings: '24x7',
  },
  {
    state: 'Bihar',
    inCharge: 'Dr. Umesh Kumar Singh',
    contact: ['7524963177', '+91-612-2294204', '+91-612-2294205', '+91-9431089514'],
    email: 'secy-disastermgmt-bih@nic.in',
    website: 'https://state.bihar.gov.in/disastermgmt',
    timings: '24x7',
  },
  {
    state: 'Chandigarh (UT)',
    inCharge: 'Sanjiv Kohli',
    contact: ['+91-172-2704048', '+91-9915557733'],
    email: 'civildefence.chandigarh@gmail.com',
    website: 'https://chandigarh.gov.in/departments/other-departments/sdma',
    timings: '24x7',
  },
  {
    state: 'Chhattisgarh',
    inCharge: 'Shri Umesh Kumar Patel',
    contact: ['+91-771-2221242', '+91-771-2510593', '8839186515'],
    email: 'cgrelief@gmail.com',
    website: 'https://sdma.cg.nic.in/',
    timings: 'June to Oct.',
  },
  {
    state: 'Dadra & Nagar Haveli Daman & Diu',
    inCharge: 'Shri Jignesh Jadav',
    contact: ['7990365385', '+91-9426779928', '+91-260-2253000', '+91-260-112', '+91-9099600112'],
    email: 'eoc-dnhdd@nic.in',
    website: 'https://ddd.gov.in/',
    timings: '24x7',
  },
  {
    state: 'Delhi',
    inCharge: 'Shri Sushil Singh',
    contact: ['9868866666', '0107', '011-23982164', '011-23831077'],
    email: 'ddma1077.delhi@nic.in',
    website: 'https://ddma.delhi.gov.in/',
    timings: '24x7',
  },
  {
    state: 'Goa',
    inCharge: 'Ms. Isha Sawant',
    contact: ['+91-832-2419444', '+91-832-2419446', '+91-7875015991'],
    email: ['usrev1-sect.goa@nic.in', 'usrev2-sect.goa@nic.in'],
    website: 'https://sdma.goa.gov.in/',
    timings: '24x7',
  },
  {
    state: 'Gujarat',
    inCharge: 'Smt. R. N. Kushwaha',
    contact: ['+91-79-23251900', '+91-79-23251903', '9978903431'],
    email: 'revcontrol1@gujarat.gov.in',
    website: 'http://gsdma.org/',
    timings: '24x7',
  },
  {
    state: 'Haryana',
    inCharge: 'Smt. Ritesh Sahu',
    contact: ['+91-172-2545938', '+91-7015375601'],
    email: 'sdmaharyana@gmail.com',
    website: 'http://hdma.gov.in/en',
    timings: '24x7',
  },
  {
    state: 'Himachal Pradesh',
    inCharge: 'Mr. Rajender Katariya',
    contact: ['+91-177-2628940', '+91-8629880160'],
    email: ['seocshimla@gmail.com', 'sdma_hp@nic.in'],
    website: 'https://hpsdma.nic.in/',
    timings: '24x7',
  },
  {
    state: 'Jammu & Kashmir',
    inCharge: 'Aamir Ali, Shri Mohd. Irfaan',
    contact: ['+91-191-2303399', '+91-9419007285', '+91-9419172201'],
    email: ['jksdma@gmail.com', 'pcrjammuoff@jkpolice.gov.in', 'pcrkashmir@gmail.com'],
    website: 'https://jksdma.jk.gov.in/',
    timings: '24x7',
  },
  {
    state: 'Jharkhand',
    inCharge: 'Shri. Sushil Kumar, Dy Secretary',
    contact: ['7015375601', '+91-651-2446923', '+91-9410992681'],
    email: 'dmjharkhand@gmail.com',
    website: 'https://www.jharkhand.gov.in/home',
    timings: '24x5 (Mon to Fri)',
  },
  {
    state: 'Karnataka',
    inCharge: 'Dr. Manoj Rajan, IFS, Commissioner',
    contact: ['9448290282', '080-22340676', '080-22353980'],
    email: 'sodmrevenue@gmail.com',
    website: 'https://ksdma.karnataka.gov.in/english',
    timings: '24x7',
  },
  {
    state: 'Kerala',
    inCharge: 'Dr. Shekhar L. Kuriakose',
    contact: ['+91-471-2364424', '9400202927'],
    email: 'keralasdma@gmail.com',
    website: 'https://sdma.kerala.gov.in/',
    timings: '24x7',
  },
  {
    state: 'Ladakh (UT)',
    inCharge: 'Mohd. Baqir, Inspector',
    contact: ['+91-1982-251169', '+91-1982-260887', '260888'],
    email: 'igpladakh@gmail.com',
    website: 'https://leh.nic.in/document-category/disaster-management/',
    timings: '24x7',
  },
  {
    state: 'Lakshadweep',
    inCharge: 'Sh. Hareshwar V Swamy, IPS, Inspector',
    contact: ['8700889157', '+91-4896-263100', '+91-9447482258'],
    email: ['controlroomkvt@gmail.com', 'lk-coll@nic.in', 'ldmaeoc@gmail.com'],
    website: 'https://lakshadweep.gov.in/disaster-management/',
    timings: '24x7',
  },
  {
    state: 'Madhya Pradesh',
    inCharge: 'Smt. Suman Lala Mahur, Dy. Relief Commissioner',
    contact: ['+91-755-2441419', '+91-755-2527177', '+91-8964903409'],
    email: 'reliefcom@nic.in',
    website: 'https://mpsdma.mp.gov.in',
    timings: '24x7',
  },
  {
    state: 'Maharashtra',
    inCharge: 'Shri Appa Sodhulaj, Director DM',
    contact: ['+91-22-22027990', '+91-22-22794229', '+918007902145'],
    email: ['controlroom@maharashtra.gov.in', 'director.dm@maharashtra.gov.in'],
    website: 'https://rfd.maharashtra.gov.in/en',
    timings: '24x7',
  },
  {
    state: 'Manipur',
    inCharge: 'Shri Chandar Sekhar, Sr Consultant & Mr. Ranjit, Research Officer',
    contact: ['8787350581', '+91-385-2443941', '+91-385-2443441', '+919612642060'],
    email: 'ranjitoff@gmail.com',
    website: 'https://manipur.gov.in/?page_id=1649',
    timings: '24x7',
  },
  {
    state: 'Meghalaya',
    inCharge: 'Mr. Matsiewdar Nongdri, Director & Sh. Surajit, Consultant',
    contact: ['7005959726', '+91364-2502098', '+91-6009924512'],
    email: 'sdmadeptt007@gmail.com',
    website: 'https://msdma.gov.in/',
    timings: '24x7',
  },
  {
    state: 'Mizoram',
    inCharge: 'Dr. Lalrokima Chenkual, Dy Director',
    contact: ['9436195861', '+91-389-2342520', '+91-389-2335837', '+91-9862661763', '+91-9615332933'],
    email: ['mizoramdmr@gmail.com', 'dmr.gov@gmail.com'],
    website: 'https://dmr.mizoram.gov.in/',
    timings: '24x7',
  },
  {
    state: 'Nagaland',
    inCharge: 'Shriu Johnny Ruangmei & Shri Rendemo Shitio, State Emergency Response Officer',
    contact: ['9856680933', '0370-22911200', '9402489435'],
    email: ['sdma.nagaland@gmail.com', 'seoc.nsdma@gmail.com'],
    website: 'https://nsdma.nagaland.gov.in/home',
    timings: '24x7',
  },
  {
    state: 'Odisha',
    inCharge: 'Shyamal Kumar Das, OSD',
    contact: ['9437111705', '+91-674-2534177'],
    email: 'srcodishagov@gmail.com',
    website: 'https://www.osdma.org/?lang=en',
    timings: '24x7',
  },
  {
    state: 'Puducherry',
    inCharge: 'Shri K. K. Bibeesh Dass & Mr. Tamil Selven, Dy Collector, PSDMA',
    contact: ['9443352328', '09442485185', '+91-413-2253407'],
    email: ['seoc.pon@nic.in', 'eocpdy@gmail.com'],
    website: 'https://puducherry-dt.gov.in/disaster-management/',
    timings: '24x7',
  },
  {
    state: 'Punjab',
    inCharge: 'Sh. Virender Pal Singh, Superintendent of Police & Shri. Pawan Kumar, Inspector',
    contact: ['9779800888', '7889234248', '0172-2740298', '0172-2720153'],
    email: 'sccr.pd2020@gmail.com',
    website: 'https://revenue.punjab.gov.in/?q=floodsnatural-calamities',
    timings: '24x7',
  },
  {
    state: 'Rajasthan',
    inCharge: 'Bijendra Singh, OSD',
    contact: ['9414000240', '+91-141-2227084'],
    email: 'relief-rj@nic.in',
    website: 'https://dmrelief.rajasthan.gov.in/#',
    timings: 'June to Sep Monsoon',
  },
  {
    state: 'Sikkim',
    inCharge: 'Shri Prabhakar Rai, Director & Shri Rajeev Roka, Addl. Director & Smt. Parne Gurung, Joint Secretary',
    contact: ['9434179141', '7550919639', '8371850117', '+91-359-2201145', '+91-9647872307', '+91-9434137226'],
    email: 'ssdma01@gmail.com',
    website: 'https://www.ssdma.nic.in/',
    timings: '24x7',
  },
  {
    state: 'Tamil Nadu',
    inCharge: 'Shri Muthu Kumaran, Joint Director (DM)',
    contact: ['09444446559', '044-28593990', '044-28414513', '9445869849'],
    email: 'tnstateeoc@gmail.com',
    website: 'https://www.cra.tn.gov.in/disaster.php',
    timings: '24x7',
  },
  {
    state: 'Telangana',
    inCharge: 'SH. Ram Manohar, SO (DM) & Ms Kavita, SO (DM)',
    contact: ['9848754026', '8309386071', '040-23454088', '1079', '9505027167'],
    email: ['instaxx@telangana.gov.in', 'commr_dm@telangana.gov.in'],
    website: 'https://fire.telangana.gov.in/',
    timings: 'SEOC Not Established',
  },
  {
    state: 'Tripura',
    inCharge: 'Dr. Sarat Kumar Das, State Project Officer & Mr. Suman Dev, Capacity Building Officer',
    contact: ['9436461940', '7005666403', '9856918665', '+91-381-2416045', '+91-381-2416241', '+91-8787676210'],
    email: 'scrtripura@gmail.com',
    website: 'https://tdma.tripura.gov.in/',
    timings: '24x7',
  },
  {
    state: 'Uttarakhand',
    inCharge: 'Mr. Rahul Jugrani, In-Charge of SEOC',
    contact: ['+91-135-2710334', '+91-335-09557444486', '+91-9152443853'],
    email: 'seoc.dmmc@gmail.com',
    website: 'https://usdma.uk.gov.in/',
    timings: '24x7',
  },
  {
    state: 'Uttar Pradesh',
    inCharge: 'Smt. Aditi Umaro, Project Director',
    contact: ['09336612864', '+91-522-2235083', '+91-9336612864'],
    email: 'rahat@nic.in',
    website: 'https://upsdma.up.nic.in/',
    timings: '24x7',
  },
  {
    state: 'West Bengal',
    inCharge: 'Mr. Shantou Dass, Joint Secretary',
    contact: ['+91-33-22143526', '22141378(F)'],
    email: 'wbdmeoc@gmail.com',
    website: 'http://wbdmd.gov.in/Pages/Default.aspx',
    timings: '24x7',
  },
];

export default function EmergencyContacts() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const filteredContacts = emergencyContacts.filter((contact) =>
    contact.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-green-600 hover:text-green-500 font-medium transition-colors mb-6"
        >
          <FaArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 animate-fade-in">
            Emergency Contacts Directory
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Quick access to emergency services across India
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-lg mx-auto">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by state or ministry..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-gray-900"
            />
          </div>
        </div>

        {/* Contacts Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-2xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-800 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">State/Ministry</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">In Charge</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Contact Numbers</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Email & Website</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Timings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContacts.map((contact, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900 font-medium">{contact.state}</td>
                  <td className="px-6 py-4 text-gray-700">{contact.inCharge}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      {contact.contact.map((num, idx) => (
                        <a
                          key={idx}
                          href={`tel:${num}`}
                          className="flex items-center gap-2 text-green-600 hover:text-green-500 transition-colors"
                        >
                          <FaPhone className="w-4 h-4" />
                          {num}
                        </a>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      {Array.isArray(contact.email) ? (
                        contact.email.map((email, idx) => (
                          <a
                            key={idx}
                            href={`mailto:${email}`}
                            className="flex items-center gap-2 text-green-600 hover:text-green-500 transition-colors"
                          >
                            <FaEnvelope className="w-4 h-4" />
                            {email}
                          </a>
                        ))
                      ) : (
                        <a
                          href={`mailto:${contact.email}`}
                          className="flex items-center gap-2 text-green-600 hover:text-green-500 transition-colors"
                        >
                          <FaEnvelope className="w-4 h-4" />
                          {contact.email}
                        </a>
                      )}
                      <a
                        href={contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-green-600 hover:text-green-500 transition-colors"
                      >
                        <FaExternalLinkAlt className="w-4 h-4" />
                        Visit Website
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        contact.timings === '24x7'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {contact.timings}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No Results Message */}
        {filteredContacts.length === 0 && (
          <div className="text-center mt-8">
            <FaSearch className="mx-auto w-12 h-12 text-gray-400" />
            <p className="mt-4 text-lg text-gray-600">No results found for "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}