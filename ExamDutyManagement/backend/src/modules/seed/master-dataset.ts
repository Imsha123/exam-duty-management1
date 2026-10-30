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


export interface SeedEmployee {
  resourceId: string;
  name: string;
  mobile: string;
  email: string;
  city: string;
  aadhaarNumber: string;
  panNumber: string;
}

export const MASTER_EMPLOYEES: SeedEmployee[] = [
  {
    "resourceId": "508259",
    "name": "Surya Mv",
    "mobile": "9663541128",
    "email": "itsuryaa14@gmail.com",
    "city": "Shivamogga(Shimoga)",
    "aadhaarNumber": "982471307185",
    "panNumber": "ABCDE3142F"
  },
  {
    "resourceId": "76999",
    "name": "Gagana D",
    "mobile": "8722066848",
    "email": "gagana.smg16@gmail.com",
    "city": "Shivamogga(Shimoga)",
    "aadhaarNumber": "982471305485",
    "panNumber": "ABCDE3141F"
  },
  {
    "resourceId": "73187",
    "name": "PREETHI M R",
    "mobile": "7829831744",
    "email": "preethimr17@gmail.com",
    "city": "Shivamogga(Shimoga)",
    "aadhaarNumber": "982471303785",
    "panNumber": "ABCDE3140F"
  },
  {
    "resourceId": "408278",
    "name": "Nesar K N",
    "mobile": "8904705401",
    "email": "nesarkn14246@gmail.com",
    "city": "Shivamogga(Shimoga)",
    "aadhaarNumber": "982471302085",
    "panNumber": "ABCDE3139F"
  },
  {
    "resourceId": "371546",
    "name": "Gowthami M",
    "mobile": "7996080850",
    "email": "gowthamimgowthamim323@gmail.com",
    "city": "Mysuru(Mysore)",
    "aadhaarNumber": "982471300385",
    "panNumber": "ABCDE3138F"
  },
  {
    "resourceId": "416691",
    "name": "Shreyas S",
    "mobile": "9611642558",
    "email": "shreyasmysuru6@gmail.com",
    "city": "Mysuru(Mysore)",
    "aadhaarNumber": "982471298685",
    "panNumber": "ABCDE3137F"
  },
  {
    "resourceId": "418794",
    "name": "Shwetha S",
    "mobile": "8792770919",
    "email": "shwethagowda199721@gmail.com",
    "city": "Mysuru(Mysore)",
    "aadhaarNumber": "982471296985",
    "panNumber": "ABCDE3136F"
  },
  {
    "resourceId": "223644",
    "name": "Pallavi T C",
    "mobile": "9535610696",
    "email": "pallavitcpinki@gmail.com",
    "city": "Mysuru(Mysore)",
    "aadhaarNumber": "982471295285",
    "panNumber": "ABCDE3135F"
  },
  {
    "resourceId": "83325",
    "name": "Padmini V",
    "mobile": "9964842244",
    "email": "padhugowda94@gmail.com",
    "city": "Mysuru(Mysore)",
    "aadhaarNumber": "982471293585",
    "panNumber": "ABCDE3134F"
  },
  {
    "resourceId": "382453",
    "name": "Nagalakshmi K M",
    "mobile": "9071328980",
    "email": "nagalakshmikm09@gmail.com",
    "city": "Mysuru(Mysore)",
    "aadhaarNumber": "982471291885",
    "panNumber": "ABCDE3133F"
  },
  {
    "resourceId": "366712",
    "name": "KAVYASHREE R",
    "mobile": "6362415068",
    "email": "chinnu.r6362@gmail.com",
    "city": "Mysuru(Mysore)",
    "aadhaarNumber": "982471290185",
    "panNumber": "ABCDE3132F"
  },
  {
    "resourceId": "363442",
    "name": "Bhagavathi Soni",
    "mobile": "6361261011",
    "email": "bhagavathisoni22@gamil.com",
    "city": "Mysuru(Mysore)",
    "aadhaarNumber": "982471288485",
    "panNumber": "ABCDE3131F"
  },
  {
    "resourceId": "470169",
    "name": "Akash. M",
    "mobile": "7795284336",
    "email": "akashjss2004@gmail.com",
    "city": "Mysuru(Mysore)",
    "aadhaarNumber": "982471286785",
    "panNumber": "ABCDE3130F"
  },
  {
    "resourceId": "188728",
    "name": "Darren Jeeth Fernandes",
    "mobile": "9480918360",
    "email": "darrenjeethfernandes@gmail.com",
    "city": "Mangaluru(Mangalore)",
    "aadhaarNumber": "982471285085",
    "panNumber": "ABCDE3129F"
  },
  {
    "resourceId": "275388",
    "name": "POOJITH D POOJARY",
    "mobile": "9108036651",
    "email": "poojithpoojary22126@gmail.com",
    "city": "Mangaluru(Mangalore)",
    "aadhaarNumber": "982471283385",
    "panNumber": "ABCDE3128F"
  },
  {
    "resourceId": "31074",
    "name": "K Venu Madhuri",
    "mobile": "9448255021",
    "email": "venumadhuri2018@gmail.com",
    "city": "Mangaluru(Mangalore)",
    "aadhaarNumber": "982471281685",
    "panNumber": "ABCDE3127F"
  },
  {
    "resourceId": "311001",
    "name": "SAHANA S",
    "mobile": "8884974029",
    "email": "sahanash01@gmail.com",
    "city": "Mandya",
    "aadhaarNumber": "982471279985",
    "panNumber": "ABCDE3126F"
  },
  {
    "resourceId": "366721",
    "name": "Prajwal A",
    "mobile": "6366583125",
    "email": "savithaprajju30@gmail.com",
    "city": "Mandya",
    "aadhaarNumber": "982471278285",
    "panNumber": "ABCDE3125F"
  },
  {
    "resourceId": "436477",
    "name": "Manoj H P",
    "mobile": "9353161447",
    "email": "manumanup046@gmail.com",
    "city": "Hassan",
    "aadhaarNumber": "982471276585",
    "panNumber": "ABCDE3124F"
  },
  {
    "resourceId": "436484",
    "name": "Vishwas B",
    "mobile": "8139993595",
    "email": "vishwasvishu045@gmail.com",
    "city": "Hassan",
    "aadhaarNumber": "982471274885",
    "panNumber": "ABCDE3123F"
  },
  {
    "resourceId": "508247",
    "name": "NIKHIL SHETTY",
    "mobile": "7411470984",
    "email": "nikhilshetty.nikhil03@gmail.com",
    "city": "Hassan",
    "aadhaarNumber": "982471273185",
    "panNumber": "ABCDE3122F"
  },
  {
    "resourceId": "151887",
    "name": "V Vinay",
    "mobile": "8317408493",
    "email": "vinayravi262003@gmail.com",
    "city": "Hassan",
    "aadhaarNumber": "982471271485",
    "panNumber": "ABCDE3121F"
  },
  {
    "resourceId": "451065",
    "name": "Dhanush M Hosur",
    "mobile": "9591323032",
    "email": "mhdhanush2006@gmail.com",
    "city": "Hassan",
    "aadhaarNumber": "982471269785",
    "panNumber": "ABCDE3120F"
  },
  {
    "resourceId": "455989",
    "name": "K RAJITHA",
    "mobile": "7204979923",
    "email": "ranjudady3@gmail.com",
    "city": "Davanagere",
    "aadhaarNumber": "982471268085",
    "panNumber": "ABCDE3119F"
  },
  {
    "resourceId": "455991",
    "name": "FAMIDA FAMIDA",
    "mobile": "9535584828",
    "email": "famidap91@gmail.com",
    "city": "Davanagere",
    "aadhaarNumber": "982471266385",
    "panNumber": "ABCDE3118F"
  },
  {
    "resourceId": "489353",
    "name": "Hemalatha M",
    "mobile": "9901248534",
    "email": "hemalatha.m050204@gmail.com",
    "city": "Bengaluru",
    "aadhaarNumber": "982471264685",
    "panNumber": "ABCDE3117F"
  },
  {
    "resourceId": "436097",
    "name": "Bantrothu Mohan Raju",
    "mobile": "6301102022",
    "email": "bantrothumohanraju@gmail.com",
    "city": "Bengaluru",
    "aadhaarNumber": "982471262985",
    "panNumber": "ABCDE3116F"
  },
  {
    "resourceId": "492078",
    "name": "Dandu Dhanya",
    "mobile": "8143769674",
    "email": "dhanya0323@gmail.com",
    "city": "Bengaluru",
    "aadhaarNumber": "982471261285",
    "panNumber": "ABCDE3115F"
  },
  {
    "resourceId": "176996",
    "name": "Prajwal R",
    "mobile": "9731263084",
    "email": "prajupower666@gmail.com",
    "city": "Bengaluru",
    "aadhaarNumber": "982471259585",
    "panNumber": "ABCDE3114F"
  },
  {
    "resourceId": "482102",
    "name": "Vishal V",
    "mobile": "8217030274",
    "email": "vislbj110303@gmail.com",
    "city": "Bengaluru",
    "aadhaarNumber": "982471257885",
    "panNumber": "ABCDE3113F"
  },
  {
    "resourceId": "407057",
    "name": "SURAJ PRAKASH",
    "mobile": "8863877751",
    "email": "surajsuraj200311m@gmail.com",
    "city": "Bengaluru",
    "aadhaarNumber": "982471256185",
    "panNumber": "ABCDE3112F"
  },
  {
    "resourceId": "304421",
    "name": "Sowjanya S",
    "mobile": "8970852377",
    "email": "sowjanyasj01@gmail.com",
    "city": "Bengaluru",
    "aadhaarNumber": "982471254485",
    "panNumber": "ABCDE3111F"
  },
  {
    "resourceId": "426465",
    "name": "SOMESHA L N",
    "mobile": "7204755853",
    "email": "someshln4@gmail.com",
    "city": "Bengaluru",
    "aadhaarNumber": "982471252785",
    "panNumber": "ABCDE3110F"
  },
  {
    "resourceId": "582699",
    "name": "Shreyas B S",
    "mobile": "8792318283",
    "email": "shreyasbs336@gmail.com",
    "city": "Bengaluru",
    "aadhaarNumber": "982471251085",
    "panNumber": "ABCDE3109F"
  },
  {
    "resourceId": "573262",
    "name": "Navyashree A P",
    "mobile": "6363251704",
    "email": "navyapgowda0111@gmail.com",
    "city": "Bengaluru",
    "aadhaarNumber": "982471249385",
    "panNumber": "ABCDE3108F"
  },
  {
    "resourceId": "537299",
    "name": "N Nandini",
    "mobile": "8147500878",
    "email": "nandiningowda30@gmail.com",
    "city": "Bengaluru",
    "aadhaarNumber": "982471247685",
    "panNumber": "ABCDE3107F"
  },
  {
    "resourceId": "511760",
    "name": "Lakshmidevi",
    "mobile": "7349509389",
    "email": "lakshmihakari617@gmail.com",
    "city": "Bengaluru",
    "aadhaarNumber": "982471245985",
    "panNumber": "ABCDE3106F"
  },
  {
    "resourceId": "446517",
    "name": "JOYCE S",
    "mobile": "8618247694",
    "email": "joysj7899@gmail.com",
    "city": "Bengaluru",
    "aadhaarNumber": "982471244285",
    "panNumber": "ABCDE3105F"
  },
  {
    "resourceId": "447433",
    "name": "Himashree C M",
    "mobile": "9591817563",
    "email": "shreehima272@gmail.com",
    "city": "Bengaluru",
    "aadhaarNumber": "982471242585",
    "panNumber": "ABCDE3104F"
  },
  {
    "resourceId": "409871",
    "name": "HARISH N",
    "mobile": "6363905406",
    "email": "harish.hari978767@gmail.com",
    "city": "Bengaluru",
    "aadhaarNumber": "982471240885",
    "panNumber": "ABCDE3103F"
  },
  {
    "resourceId": "580258",
    "name": "Dorebhagavan N K",
    "mobile": "8880782078",
    "email": "dore1191@gmail.com",
    "city": "Bengaluru",
    "aadhaarNumber": "982471239185",
    "panNumber": "ABCDE3102F"
  },
  {
    "resourceId": "409882",
    "name": "BHAVISH GOWDA N",
    "mobile": "7411166877",
    "email": "bhavishgowdru@gmail.com",
    "city": "Bengaluru",
    "aadhaarNumber": "982471237485",
    "panNumber": "ABCDE3101F"
  },
  {
    "resourceId": "433811",
    "name": "Amaranatha C",
    "mobile": "7975820179",
    "email": "amaranathaamara32@gmail.com",
    "city": "Bengaluru",
    "aadhaarNumber": "982471235785",
    "panNumber": "ABCDE3100F"
  },
  {
    "resourceId": "59258",
    "name": "UG",
    "mobile": "9845682217",
    "email": "chandanaitsolutions@gmail.com",
    "city": "Mysore",
    "aadhaarNumber": "895253474752",
    "panNumber": "ABCD12345F"
  },
  {
    "resourceId": "597302",
    "name": "imsha",
    "mobile": "4521936841",
    "email": "imsh@gmail.com",
    "city": "Mysore",
    "aadhaarNumber": "489270985593",
    "panNumber": "ABCD12345F"
  },
  {
    "resourceId": "597294",
    "name": "Rufaida",
    "mobile": "7975302707",
    "email": "mehek@gmail.com",
    "city": "Mysore",
    "aadhaarNumber": "531609866060",
    "panNumber": "ABCD1234FE"
  },
  {
    "resourceId": "597305",
    "name": "rajesh",
    "mobile": "9886915446",
    "email": "rajesh@gmail.com",
    "city": "Mysore",
    "aadhaarNumber": "489251238713",
    "panNumber": "ABCD1234F"
  }
];
