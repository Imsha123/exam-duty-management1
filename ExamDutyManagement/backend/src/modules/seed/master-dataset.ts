/**
 * Master dataset seeded from:
 * "city, center name and center code AWIGNA (1).xlsx"
 * 25 Cities, 113 Exam Centers
 */

export interface SeedCity {
  name: string;
  state: string;
}

export interface SeedCenter {
  city: string;
  centerCode: string;
  centerName: string;
  address?: string;
}

export const MASTER_CITIES: SeedCity[] = [
  {
    "name": "Bagalkot",
    "state": "Karnataka"
  },
  {
    "name": "Ballari(Bellary)",
    "state": "Karnataka"
  },
  {
    "name": "Belagavi(Belgaum)",
    "state": "Karnataka"
  },
  {
    "name": "Bengaluru",
    "state": "Karnataka"
  },
  {
    "name": "Bidar",
    "state": "Karnataka"
  },
  {
    "name": "Chikballapur",
    "state": "Karnataka"
  },
  {
    "name": "Chikkamagaluru",
    "state": "Karnataka"
  },
  {
    "name": "Davanagere",
    "state": "Karnataka"
  },
  {
    "name": "Dharwad",
    "state": "Karnataka"
  },
  {
    "name": "Gadag",
    "state": "Karnataka"
  },
  {
    "name": "HOSPET",
    "state": "Karnataka"
  },
  {
    "name": "Hassan",
    "state": "Karnataka"
  },
  {
    "name": "Haveri",
    "state": "Karnataka"
  },
  {
    "name": "Hubballi(Hubli)",
    "state": "Karnataka"
  },
  {
    "name": "Kalaburagi(Gulbarga)",
    "state": "Karnataka"
  },
  {
    "name": "Kolar",
    "state": "Karnataka"
  },
  {
    "name": "Mandya",
    "state": "Karnataka"
  },
  {
    "name": "Mangaluru(Mangalore)",
    "state": "Karnataka"
  },
  {
    "name": "Mysuru(Mysore)",
    "state": "Karnataka"
  },
  {
    "name": "Puttur",
    "state": "Karnataka"
  },
  {
    "name": "Shivamogga(Shimoga)",
    "state": "Karnataka"
  },
  {
    "name": "Tumkur",
    "state": "Karnataka"
  },
  {
    "name": "Udupi",
    "state": "Karnataka"
  },
  {
    "name": "Uttara Kannada",
    "state": "Karnataka"
  },
  {
    "name": "Vijayapura(Bijapur)",
    "state": "Karnataka"
  }
];

export const MASTER_CENTERS: SeedCenter[] = [
  {
    "city": "Bagalkot",
    "centerCode": "963",
    "centerName": "Basaveshwar Engineering College",
    "address": "Basaveshwar Engineering College, Bagalkot"
  },
  {
    "city": "Bagalkot",
    "centerCode": "42236",
    "centerName": "Biluru Gurubasava Mahaswamiji Institute of Technology",
    "address": "Biluru Gurubasava Mahaswamiji Institute of Technology, Bagalkot"
  },
  {
    "city": "Ballari(Bellary)",
    "centerCode": "1435",
    "centerName": "Ballari Institute of Technology & Management",
    "address": "Ballari Institute of Technology & Management, Ballari(Bellary)"
  },
  {
    "city": "Ballari(Bellary)",
    "centerCode": "294",
    "centerName": "Rao Bahadur Y.Mahabaleshwarappa Engineering College",
    "address": "Rao Bahadur Y.Mahabaleshwarappa Engineering College, Ballari(Bellary)"
  },
  {
    "city": "Belagavi(Belgaum)",
    "centerCode": "11398",
    "centerName": "iON Digital Zone iDZ Airport Road",
    "address": "iON Digital Zone iDZ Airport Road, Belagavi(Belgaum)"
  },
  {
    "city": "Belagavi(Belgaum)",
    "centerCode": "37505",
    "centerName": "Infojiva IT Services LLP",
    "address": "Infojiva IT Services LLP, Belagavi(Belgaum)"
  },
  {
    "city": "Belagavi(Belgaum)",
    "centerCode": "9090",
    "centerName": "SJPN Trusts BCA College",
    "address": "SJPN Trusts BCA College, Belagavi(Belgaum)"
  },
  {
    "city": "Belagavi(Belgaum)",
    "centerCode": "979",
    "centerName": "Jain College of Engineering",
    "address": "Jain College of Engineering, Belagavi(Belgaum)"
  },
  {
    "city": "Belagavi(Belgaum)",
    "centerCode": "42238",
    "centerName": "Anuvartik Mirji Bharatesh Institute of Technology",
    "address": "Anuvartik Mirji Bharatesh Institute of Technology, Belagavi(Belgaum)"
  },
  {
    "city": "Belagavi(Belgaum)",
    "centerCode": "1417",
    "centerName": "K.L.E. Dr. M.S. Sheshgiri College of Engineering and Technology",
    "address": "K.L.E. Dr. M.S. Sheshgiri College of Engineering and Technology, Belagavi(Belgaum)"
  },
  {
    "city": "Belagavi(Belgaum)",
    "centerCode": "2450",
    "centerName": "Hirasugar Institute of Technology",
    "address": "Hirasugar Institute of Technology, Belagavi(Belgaum)"
  },
  {
    "city": "Bengaluru",
    "centerCode": "42057",
    "centerName": "iON Digital Zone iDZ Harohalli",
    "address": "iON Digital Zone iDZ Harohalli, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "7974",
    "centerName": "iON Digital Zone iDZ Rajarajeswari Medical College and Hospital",
    "address": "iON Digital Zone iDZ Rajarajeswari Medical College and Hospital, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "37272",
    "centerName": "eMerit",
    "address": "eMerit, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "163",
    "centerName": "HKBK College of Engineering",
    "address": "HKBK College of Engineering, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "40086",
    "centerName": "eTalent",
    "address": "eTalent, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "40071",
    "centerName": "Techxcellence Digital Solutions",
    "address": "Techxcellence Digital Solutions, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "9345",
    "centerName": "Rain Cloud Technologies",
    "address": "Rain Cloud Technologies, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "7814",
    "centerName": "Reverend Technologies",
    "address": "Reverend Technologies, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "40168",
    "centerName": "Digimetrics",
    "address": "Digimetrics, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "33958",
    "centerName": "Milestone Technologies",
    "address": "Milestone Technologies, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "8210",
    "centerName": "Dayananda Sagar University",
    "address": "Dayananda Sagar University, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "8349",
    "centerName": "M.S.Ramaiah University of Applied Sciences",
    "address": "M.S.Ramaiah University of Applied Sciences, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "35699",
    "centerName": "BITBYTECH Solutions",
    "address": "BITBYTECH Solutions, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "3015",
    "centerName": "K S School of Engineering and Management Bengaluru",
    "address": "K S School of Engineering and Management Bengaluru, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "8361",
    "centerName": "BMS College of Engineering",
    "address": "BMS College of Engineering, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "772",
    "centerName": "Cambridge Institute Of Technology",
    "address": "Cambridge Institute Of Technology, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "250",
    "centerName": "M S Engineering College",
    "address": "M S Engineering College, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "632",
    "centerName": "ACS College of Engineering",
    "address": "ACS College of Engineering, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "531",
    "centerName": "Vemana Institute of Technology",
    "address": "Vemana Institute of Technology, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "2744",
    "centerName": "AMC Engineering College",
    "address": "AMC Engineering College, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "41880",
    "centerName": "Four Tune Tech Solutions",
    "address": "Four Tune Tech Solutions, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "532",
    "centerName": "B.N.M Institute of Technology",
    "address": "B.N.M Institute of Technology, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "150",
    "centerName": "Reva University",
    "address": "Reva University, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "714",
    "centerName": "Dayananda Sagar Academy of Technology and Management",
    "address": "Dayananda Sagar Academy of Technology and Management, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "8261",
    "centerName": "RNS Institute of Technology",
    "address": "RNS Institute of Technology, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "8218",
    "centerName": "Gopalan College of Engineering & Management",
    "address": "Gopalan College of Engineering & Management, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "2945",
    "centerName": "SJB Institute of Technology",
    "address": "SJB Institute of Technology, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "533",
    "centerName": "BMS Institute of Technology and Management",
    "address": "BMS Institute of Technology and Management, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "646",
    "centerName": "Rajarajeswari College of Engineering",
    "address": "Rajarajeswari College of Engineering, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "42240",
    "centerName": "Harsha Institute of Technology",
    "address": "Harsha Institute of Technology, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "193",
    "centerName": "Amruta Institute of Engineering and Management Sciences",
    "address": "Amruta Institute of Engineering and Management Sciences, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "2180",
    "centerName": "Don Bosco Institute of Technology",
    "address": "Don Bosco Institute of Technology, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "972",
    "centerName": "Jyothy Institute of Technology",
    "address": "Jyothy Institute of Technology, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "506",
    "centerName": "Global Academy of Technology",
    "address": "Global Academy of Technology, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "3424",
    "centerName": "Dayananda Sagar Institutions",
    "address": "Dayananda Sagar Institutions, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "42241",
    "centerName": "Akash Institute of Engineering and Technology",
    "address": "Akash Institute of Engineering and Technology, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "755",
    "centerName": "JSS Academy of Technical Education",
    "address": "JSS Academy of Technical Education, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "596",
    "centerName": "K S Institute of Technology",
    "address": "K S Institute of Technology, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "986",
    "centerName": "R.L.Jalappa Institute of Technology",
    "address": "R.L.Jalappa Institute of Technology, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "4553",
    "centerName": "Alliance University",
    "address": "Alliance University, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "42242",
    "centerName": "Aditya College of Engineering and Technology Bengaluru",
    "address": "Aditya College of Engineering and Technology Bengaluru, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "2035",
    "centerName": "Nagarjuna College of Engineering & Technology",
    "address": "Nagarjuna College of Engineering & Technology, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "3620",
    "centerName": "M S Ramaiah Institute of Technology",
    "address": "M S Ramaiah Institute of Technology, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "7856",
    "centerName": "Sir M Visvesvaraya Institute Of Technology",
    "address": "Sir M Visvesvaraya Institute Of Technology, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "29030",
    "centerName": "RV Institute of Technology and Management",
    "address": "RV Institute of Technology and Management, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "1577",
    "centerName": "Sri Sairam College of Engineering",
    "address": "Sri Sairam College of Engineering, Bengaluru"
  },
  {
    "city": "Bengaluru",
    "centerCode": "42239",
    "centerName": "Dr. H N National College of Engineering",
    "address": "Dr. H N National College of Engineering, Bengaluru"
  },
  {
    "city": "Bidar",
    "centerCode": "40800",
    "centerName": "Lingarajappa Engineering College",
    "address": "Lingarajappa Engineering College, Bidar"
  },
  {
    "city": "Chikballapur",
    "centerCode": "195",
    "centerName": "Sri Jagadguru Chandrashekaranatha Swamiji Institute of Technology",
    "address": "Sri Jagadguru Chandrashekaranatha Swamiji Institute of Technology, Chikballapur"
  },
  {
    "city": "Chikkamagaluru",
    "centerCode": "1074",
    "centerName": "Adichunchanagiri Institute of Technology",
    "address": "Adichunchanagiri Institute of Technology, Chikkamagaluru"
  },
  {
    "city": "Davanagere",
    "centerCode": "201",
    "centerName": "Bapuji Institute of Engineering & Technology",
    "address": "Bapuji Institute of Engineering & Technology, Davanagere"
  },
  {
    "city": "Davanagere",
    "centerCode": "7844",
    "centerName": "Jain Institute of Technology",
    "address": "Jain Institute of Technology, Davanagere"
  },
  {
    "city": "Davanagere",
    "centerCode": "974",
    "centerName": "GM Institute of Technology",
    "address": "GM Institute of Technology, Davanagere"
  },
  {
    "city": "Dharwad",
    "centerCode": "1575",
    "centerName": "Global Business School",
    "address": "Global Business School, Dharwad"
  },
  {
    "city": "Dharwad",
    "centerCode": "1208",
    "centerName": "Sri Dharmasthala Manjunatheshwara College of Engineering and Technology",
    "address": "Sri Dharmasthala Manjunatheshwara College of Engineering and Technology, Dharwad"
  },
  {
    "city": "Gadag",
    "centerCode": "985",
    "centerName": "Smt. Kamala and Sri Venkappa M. Agadi College of Engineering and Technology",
    "address": "Smt. Kamala and Sri Venkappa M. Agadi College of Engineering and Technology, Gadag"
  },
  {
    "city": "Hassan",
    "centerCode": "8152",
    "centerName": "Rajeev Polytechnic",
    "address": "Rajeev Polytechnic, Hassan"
  },
  {
    "city": "Hassan",
    "centerCode": "1026",
    "centerName": "Malnad College of Engineering",
    "address": "Malnad College of Engineering, Hassan"
  },
  {
    "city": "Hassan",
    "centerCode": "2670",
    "centerName": "NAVKIS College of Engineering",
    "address": "NAVKIS College of Engineering, Hassan"
  },
  {
    "city": "Haveri",
    "centerCode": "950",
    "centerName": "Sri Taralabalu Jagadguru Institute of Technology",
    "address": "Sri Taralabalu Jagadguru Institute of Technology, Haveri"
  },
  {
    "city": "HOSPET",
    "centerCode": "2630",
    "centerName": "Proudadevaraya Institute of Technology",
    "address": "Proudadevaraya Institute of Technology, HOSPET"
  },
  {
    "city": "Hubballi(Hubli)",
    "centerCode": "8030",
    "centerName": "iON Digital Zone iDZ Akshay Colony",
    "address": "iON Digital Zone iDZ Akshay Colony, Hubballi(Hubli)"
  },
  {
    "city": "Hubballi(Hubli)",
    "centerCode": "9687",
    "centerName": "Chetan Business School",
    "address": "Chetan Business School, Hubballi(Hubli)"
  },
  {
    "city": "Hubballi(Hubli)",
    "centerCode": "4521",
    "centerName": "AGMR College of Engineering and Technology",
    "address": "AGMR College of Engineering and Technology, Hubballi(Hubli)"
  },
  {
    "city": "Hubballi(Hubli)",
    "centerCode": "9558",
    "centerName": "Jain College Of Engineering And Technology Hubballi",
    "address": "Jain College Of Engineering And Technology Hubballi, Hubballi(Hubli)"
  },
  {
    "city": "Kalaburagi(Gulbarga)",
    "centerCode": "40041",
    "centerName": "Sharanabasaweshwar Vidya Vardhak Sangha",
    "address": "Sharanabasaweshwar Vidya Vardhak Sangha, Kalaburagi(Gulbarga)"
  },
  {
    "city": "Kalaburagi(Gulbarga)",
    "centerCode": "26845",
    "centerName": "Godutai Engineering College For Women",
    "address": "Godutai Engineering College For Women, Kalaburagi(Gulbarga)"
  },
  {
    "city": "Kalaburagi(Gulbarga)",
    "centerCode": "3194",
    "centerName": "Appa Institute Of Engineering & Technology",
    "address": "Appa Institute Of Engineering & Technology, Kalaburagi(Gulbarga)"
  },
  {
    "city": "Kolar",
    "centerCode": "920",
    "centerName": "Dr T Thimmaiah Institute of Technology",
    "address": "Dr T Thimmaiah Institute of Technology, Kolar"
  },
  {
    "city": "Kolar",
    "centerCode": "3348",
    "centerName": "C Byre Gowda Institute of Technology",
    "address": "C Byre Gowda Institute of Technology, Kolar"
  },
  {
    "city": "Mandya",
    "centerCode": "973",
    "centerName": "P.E.S College of Engineering",
    "address": "P.E.S College of Engineering, Mandya"
  },
  {
    "city": "Mandya",
    "centerCode": "1045",
    "centerName": "BGS Institute of Technology",
    "address": "BGS Institute of Technology, Mandya"
  },
  {
    "city": "Mandya",
    "centerCode": "8972",
    "centerName": "Cauvery Institute and Technology",
    "address": "Cauvery Institute and Technology, Mandya"
  },
  {
    "city": "Mandya",
    "centerCode": "1013",
    "centerName": "Maharaja Institute of Technology",
    "address": "Maharaja Institute of Technology, Mandya"
  },
  {
    "city": "Mandya",
    "centerCode": "8154",
    "centerName": "G.Madegowda Institute of Technology",
    "address": "G.Madegowda Institute of Technology, Mandya"
  },
  {
    "city": "Mangaluru(Mangalore)",
    "centerCode": "8594",
    "centerName": "iON Digital Zone Bondel",
    "address": "iON Digital Zone Bondel, Mangaluru(Mangalore)"
  },
  {
    "city": "Mangaluru(Mangalore)",
    "centerCode": "37202",
    "centerName": "Shri Sharada Niketana Exam and Training Institute",
    "address": "Shri Sharada Niketana Exam and Training Institute, Mangaluru(Mangalore)"
  },
  {
    "city": "Mangaluru(Mangalore)",
    "centerCode": "192",
    "centerName": "St Joseph Engineering College",
    "address": "St Joseph Engineering College, Mangaluru(Mangalore)"
  },
  {
    "city": "Mangaluru(Mangalore)",
    "centerCode": "841",
    "centerName": "Sahyadri College of Engineering and Management",
    "address": "Sahyadri College of Engineering and Management, Mangaluru(Mangalore)"
  },
  {
    "city": "Mangaluru(Mangalore)",
    "centerCode": "784",
    "centerName": "Mangalore Institute of Technology and Engineering",
    "address": "Mangalore Institute of Technology and Engineering, Mangaluru(Mangalore)"
  },
  {
    "city": "Mangaluru(Mangalore)",
    "centerCode": "8975",
    "centerName": "Yenepoya Institute of Technology",
    "address": "Yenepoya Institute of Technology, Mangaluru(Mangalore)"
  },
  {
    "city": "Mangaluru(Mangalore)",
    "centerCode": "8362",
    "centerName": "Shree Devi Institue of Technology",
    "address": "Shree Devi Institue of Technology, Mangaluru(Mangalore)"
  },
  {
    "city": "Mysuru(Mysore)",
    "centerCode": "8743",
    "centerName": "iON Digital Zone iDZ Hebbal",
    "address": "iON Digital Zone iDZ Hebbal, Mysuru(Mysore)"
  },
  {
    "city": "Mysuru(Mysore)",
    "centerCode": "11674",
    "centerName": "Chandana Resource Centre",
    "address": "Chandana Resource Centre, Mysuru(Mysore)"
  },
  {
    "city": "Mysuru(Mysore)",
    "centerCode": "984",
    "centerName": "Vidya Vardhaka College Of Engineering",
    "address": "Vidya Vardhaka College Of Engineering, Mysuru(Mysore)"
  },
  {
    "city": "Mysuru(Mysore)",
    "centerCode": "42237",
    "centerName": "Cauvery College of Engineering",
    "address": "Cauvery College of Engineering, Mysuru(Mysore)"
  },
  {
    "city": "Mysuru(Mysore)",
    "centerCode": "2678",
    "centerName": "GSSS Institute of Engineering and Technology for Women",
    "address": "GSSS Institute of Engineering and Technology for Women, Mysuru(Mysore)"
  },
  {
    "city": "Mysuru(Mysore)",
    "centerCode": "16702",
    "centerName": "MIT Thandavapura",
    "address": "MIT Thandavapura, Mysuru(Mysore)"
  },
  {
    "city": "Puttur",
    "centerCode": "1465",
    "centerName": "Vivekananda College of Engineering & Technology",
    "address": "Vivekananda College of Engineering & Technology, Puttur"
  },
  {
    "city": "Shivamogga(Shimoga)",
    "centerCode": "8560",
    "centerName": "iON Digital Zone iDZ Machenahalli",
    "address": "iON Digital Zone iDZ Machenahalli, Shivamogga(Shimoga)"
  },
  {
    "city": "Shivamogga(Shimoga)",
    "centerCode": "971",
    "centerName": "PES Institute of Technology and Management",
    "address": "PES Institute of Technology and Management, Shivamogga(Shimoga)"
  },
  {
    "city": "Shivamogga(Shimoga)",
    "centerCode": "356",
    "centerName": "Jawaharlal Nehru National College of Engineering",
    "address": "Jawaharlal Nehru National College of Engineering, Shivamogga(Shimoga)"
  },
  {
    "city": "Tumkur",
    "centerCode": "207",
    "centerName": "Siddaganga Institute of Technology",
    "address": "Siddaganga Institute of Technology, Tumkur"
  },
  {
    "city": "Tumkur",
    "centerCode": "1014",
    "centerName": "Channabasaveshwara Institute of Technology",
    "address": "Channabasaveshwara Institute of Technology, Tumkur"
  },
  {
    "city": "Tumkur",
    "centerCode": "2077",
    "centerName": "Shridevi Institute of Engineering & Technology",
    "address": "Shridevi Institute of Engineering & Technology, Tumkur"
  },
  {
    "city": "Udupi",
    "centerCode": "7975",
    "centerName": "iON Digital Zone iDZ Milk Diary Road",
    "address": "iON Digital Zone iDZ Milk Diary Road, Udupi"
  },
  {
    "city": "Udupi",
    "centerCode": "1449",
    "centerName": "Shri Madhwa Vadiraja Institute of Technology & Management",
    "address": "Shri Madhwa Vadiraja Institute of Technology & Management, Udupi"
  },
  {
    "city": "Udupi",
    "centerCode": "15832",
    "centerName": "Sri Bhuvanendra College",
    "address": "Sri Bhuvanendra College, Udupi"
  },
  {
    "city": "Udupi",
    "centerCode": "1655",
    "centerName": "Mahatma Gandhi Memorial College",
    "address": "Mahatma Gandhi Memorial College, Udupi"
  },
  {
    "city": "Udupi",
    "centerCode": "15019",
    "centerName": "Manipal Institute Of Technology",
    "address": "Manipal Institute Of Technology, Udupi"
  },
  {
    "city": "Uttara Kannada",
    "centerCode": "2548",
    "centerName": "K L S Vishwanathrao Deshpande Rural Institute of Technology",
    "address": "K L S Vishwanathrao Deshpande Rural Institute of Technology, Uttara Kannada"
  },
  {
    "city": "Vijayapura(Bijapur)",
    "centerCode": "970",
    "centerName": "Dr P G Halakatti College of Engineering and Technology",
    "address": "Dr P G Halakatti College of Engineering and Technology, Vijayapura(Bijapur)"
  }
];
