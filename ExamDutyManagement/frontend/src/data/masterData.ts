/**
 * Master dataset extracted from:
 * "city, center name and center code AWIGNA (1).xlsx"
 * 25 Cities, 113 Centers
 */

export interface MasterCityData {
  id: string;
  name: string;
  state?: string;
}

export interface MasterCenterData {
  id: string;
  centerCode: string;
  centerName: string;
  cityId: string;
  address?: string;
}

export interface MasterExamData {
  id: string;
  name: string;
  code?: string;
  type: 'Exam' | 'Mock';
}

export const INITIAL_CITIES: MasterCityData[] = [
  {
    "id": "city-bagalkot",
    "name": "Bagalkot",
    "state": "Karnataka"
  },
  {
    "id": "city-ballari-bellary-",
    "name": "Ballari(Bellary)",
    "state": "Karnataka"
  },
  {
    "id": "city-belagavi-belgaum-",
    "name": "Belagavi(Belgaum)",
    "state": "Karnataka"
  },
  {
    "id": "city-bengaluru",
    "name": "Bengaluru",
    "state": "Karnataka"
  },
  {
    "id": "city-bidar",
    "name": "Bidar",
    "state": "Karnataka"
  },
  {
    "id": "city-chikballapur",
    "name": "Chikballapur",
    "state": "Karnataka"
  },
  {
    "id": "city-chikkamagaluru",
    "name": "Chikkamagaluru",
    "state": "Karnataka"
  },
  {
    "id": "city-davanagere",
    "name": "Davanagere",
    "state": "Karnataka"
  },
  {
    "id": "city-dharwad",
    "name": "Dharwad",
    "state": "Karnataka"
  },
  {
    "id": "city-gadag",
    "name": "Gadag",
    "state": "Karnataka"
  },
  {
    "id": "city-hospet",
    "name": "HOSPET",
    "state": "Karnataka"
  },
  {
    "id": "city-hassan",
    "name": "Hassan",
    "state": "Karnataka"
  },
  {
    "id": "city-haveri",
    "name": "Haveri",
    "state": "Karnataka"
  },
  {
    "id": "city-hubballi-hubli-",
    "name": "Hubballi(Hubli)",
    "state": "Karnataka"
  },
  {
    "id": "city-kalaburagi-gulbarga-",
    "name": "Kalaburagi(Gulbarga)",
    "state": "Karnataka"
  },
  {
    "id": "city-kolar",
    "name": "Kolar",
    "state": "Karnataka"
  },
  {
    "id": "city-mandya",
    "name": "Mandya",
    "state": "Karnataka"
  },
  {
    "id": "city-mangaluru-mangalore-",
    "name": "Mangaluru(Mangalore)",
    "state": "Karnataka"
  },
  {
    "id": "city-mysuru-mysore-",
    "name": "Mysuru(Mysore)",
    "state": "Karnataka"
  },
  {
    "id": "city-puttur",
    "name": "Puttur",
    "state": "Karnataka"
  },
  {
    "id": "city-shivamogga-shimoga-",
    "name": "Shivamogga(Shimoga)",
    "state": "Karnataka"
  },
  {
    "id": "city-tumkur",
    "name": "Tumkur",
    "state": "Karnataka"
  },
  {
    "id": "city-udupi",
    "name": "Udupi",
    "state": "Karnataka"
  },
  {
    "id": "city-uttara-kannada",
    "name": "Uttara Kannada",
    "state": "Karnataka"
  },
  {
    "id": "city-vijayapura-bijapur-",
    "name": "Vijayapura(Bijapur)",
    "state": "Karnataka"
  }
];

export const INITIAL_CENTERS: MasterCenterData[] = [
  {
    "id": "center-963",
    "centerCode": "963",
    "centerName": "Basaveshwar Engineering College",
    "cityId": "city-bagalkot",
    "address": "Basaveshwar Engineering College, Bagalkot"
  },
  {
    "id": "center-42236",
    "centerCode": "42236",
    "centerName": "Biluru Gurubasava Mahaswamiji Institute of Technology",
    "cityId": "city-bagalkot",
    "address": "Biluru Gurubasava Mahaswamiji Institute of Technology, Bagalkot"
  },
  {
    "id": "center-1435",
    "centerCode": "1435",
    "centerName": "Ballari Institute of Technology & Management",
    "cityId": "city-ballari-bellary-",
    "address": "Ballari Institute of Technology & Management, Ballari(Bellary)"
  },
  {
    "id": "center-294",
    "centerCode": "294",
    "centerName": "Rao Bahadur Y.Mahabaleshwarappa Engineering College",
    "cityId": "city-ballari-bellary-",
    "address": "Rao Bahadur Y.Mahabaleshwarappa Engineering College, Ballari(Bellary)"
  },
  {
    "id": "center-11398",
    "centerCode": "11398",
    "centerName": "iON Digital Zone iDZ Airport Road",
    "cityId": "city-belagavi-belgaum-",
    "address": "iON Digital Zone iDZ Airport Road, Belagavi(Belgaum)"
  },
  {
    "id": "center-37505",
    "centerCode": "37505",
    "centerName": "Infojiva IT Services LLP",
    "cityId": "city-belagavi-belgaum-",
    "address": "Infojiva IT Services LLP, Belagavi(Belgaum)"
  },
  {
    "id": "center-9090",
    "centerCode": "9090",
    "centerName": "SJPN Trusts BCA College",
    "cityId": "city-belagavi-belgaum-",
    "address": "SJPN Trusts BCA College, Belagavi(Belgaum)"
  },
  {
    "id": "center-979",
    "centerCode": "979",
    "centerName": "Jain College of Engineering",
    "cityId": "city-belagavi-belgaum-",
    "address": "Jain College of Engineering, Belagavi(Belgaum)"
  },
  {
    "id": "center-42238",
    "centerCode": "42238",
    "centerName": "Anuvartik Mirji Bharatesh Institute of Technology",
    "cityId": "city-belagavi-belgaum-",
    "address": "Anuvartik Mirji Bharatesh Institute of Technology, Belagavi(Belgaum)"
  },
  {
    "id": "center-1417",
    "centerCode": "1417",
    "centerName": "K.L.E. Dr. M.S. Sheshgiri College of Engineering and Technology",
    "cityId": "city-belagavi-belgaum-",
    "address": "K.L.E. Dr. M.S. Sheshgiri College of Engineering and Technology, Belagavi(Belgaum)"
  },
  {
    "id": "center-2450",
    "centerCode": "2450",
    "centerName": "Hirasugar Institute of Technology",
    "cityId": "city-belagavi-belgaum-",
    "address": "Hirasugar Institute of Technology, Belagavi(Belgaum)"
  },
  {
    "id": "center-42057",
    "centerCode": "42057",
    "centerName": "iON Digital Zone iDZ Harohalli",
    "cityId": "city-bengaluru",
    "address": "iON Digital Zone iDZ Harohalli, Bengaluru"
  },
  {
    "id": "center-7974",
    "centerCode": "7974",
    "centerName": "iON Digital Zone iDZ Rajarajeswari Medical College and Hospital",
    "cityId": "city-bengaluru",
    "address": "iON Digital Zone iDZ Rajarajeswari Medical College and Hospital, Bengaluru"
  },
  {
    "id": "center-37272",
    "centerCode": "37272",
    "centerName": "eMerit",
    "cityId": "city-bengaluru",
    "address": "eMerit, Bengaluru"
  },
  {
    "id": "center-163",
    "centerCode": "163",
    "centerName": "HKBK College of Engineering",
    "cityId": "city-bengaluru",
    "address": "HKBK College of Engineering, Bengaluru"
  },
  {
    "id": "center-40086",
    "centerCode": "40086",
    "centerName": "eTalent",
    "cityId": "city-bengaluru",
    "address": "eTalent, Bengaluru"
  },
  {
    "id": "center-40071",
    "centerCode": "40071",
    "centerName": "Techxcellence Digital Solutions",
    "cityId": "city-bengaluru",
    "address": "Techxcellence Digital Solutions, Bengaluru"
  },
  {
    "id": "center-9345",
    "centerCode": "9345",
    "centerName": "Rain Cloud Technologies",
    "cityId": "city-bengaluru",
    "address": "Rain Cloud Technologies, Bengaluru"
  },
  {
    "id": "center-7814",
    "centerCode": "7814",
    "centerName": "Reverend Technologies",
    "cityId": "city-bengaluru",
    "address": "Reverend Technologies, Bengaluru"
  },
  {
    "id": "center-40168",
    "centerCode": "40168",
    "centerName": "Digimetrics",
    "cityId": "city-bengaluru",
    "address": "Digimetrics, Bengaluru"
  },
  {
    "id": "center-33958",
    "centerCode": "33958",
    "centerName": "Milestone Technologies",
    "cityId": "city-bengaluru",
    "address": "Milestone Technologies, Bengaluru"
  },
  {
    "id": "center-8210",
    "centerCode": "8210",
    "centerName": "Dayananda Sagar University",
    "cityId": "city-bengaluru",
    "address": "Dayananda Sagar University, Bengaluru"
  },
  {
    "id": "center-8349",
    "centerCode": "8349",
    "centerName": "M.S.Ramaiah University of Applied Sciences",
    "cityId": "city-bengaluru",
    "address": "M.S.Ramaiah University of Applied Sciences, Bengaluru"
  },
  {
    "id": "center-35699",
    "centerCode": "35699",
    "centerName": "BITBYTECH Solutions",
    "cityId": "city-bengaluru",
    "address": "BITBYTECH Solutions, Bengaluru"
  },
  {
    "id": "center-3015",
    "centerCode": "3015",
    "centerName": "K S School of Engineering and Management Bengaluru",
    "cityId": "city-bengaluru",
    "address": "K S School of Engineering and Management Bengaluru, Bengaluru"
  },
  {
    "id": "center-8361",
    "centerCode": "8361",
    "centerName": "BMS College of Engineering",
    "cityId": "city-bengaluru",
    "address": "BMS College of Engineering, Bengaluru"
  },
  {
    "id": "center-772",
    "centerCode": "772",
    "centerName": "Cambridge Institute Of Technology",
    "cityId": "city-bengaluru",
    "address": "Cambridge Institute Of Technology, Bengaluru"
  },
  {
    "id": "center-250",
    "centerCode": "250",
    "centerName": "M S Engineering College",
    "cityId": "city-bengaluru",
    "address": "M S Engineering College, Bengaluru"
  },
  {
    "id": "center-632",
    "centerCode": "632",
    "centerName": "ACS College of Engineering",
    "cityId": "city-bengaluru",
    "address": "ACS College of Engineering, Bengaluru"
  },
  {
    "id": "center-531",
    "centerCode": "531",
    "centerName": "Vemana Institute of Technology",
    "cityId": "city-bengaluru",
    "address": "Vemana Institute of Technology, Bengaluru"
  },
  {
    "id": "center-2744",
    "centerCode": "2744",
    "centerName": "AMC Engineering College",
    "cityId": "city-bengaluru",
    "address": "AMC Engineering College, Bengaluru"
  },
  {
    "id": "center-41880",
    "centerCode": "41880",
    "centerName": "Four Tune Tech Solutions",
    "cityId": "city-bengaluru",
    "address": "Four Tune Tech Solutions, Bengaluru"
  },
  {
    "id": "center-532",
    "centerCode": "532",
    "centerName": "B.N.M Institute of Technology",
    "cityId": "city-bengaluru",
    "address": "B.N.M Institute of Technology, Bengaluru"
  },
  {
    "id": "center-150",
    "centerCode": "150",
    "centerName": "Reva University",
    "cityId": "city-bengaluru",
    "address": "Reva University, Bengaluru"
  },
  {
    "id": "center-714",
    "centerCode": "714",
    "centerName": "Dayananda Sagar Academy of Technology and Management",
    "cityId": "city-bengaluru",
    "address": "Dayananda Sagar Academy of Technology and Management, Bengaluru"
  },
  {
    "id": "center-8261",
    "centerCode": "8261",
    "centerName": "RNS Institute of Technology",
    "cityId": "city-bengaluru",
    "address": "RNS Institute of Technology, Bengaluru"
  },
  {
    "id": "center-8218",
    "centerCode": "8218",
    "centerName": "Gopalan College of Engineering & Management",
    "cityId": "city-bengaluru",
    "address": "Gopalan College of Engineering & Management, Bengaluru"
  },
  {
    "id": "center-2945",
    "centerCode": "2945",
    "centerName": "SJB Institute of Technology",
    "cityId": "city-bengaluru",
    "address": "SJB Institute of Technology, Bengaluru"
  },
  {
    "id": "center-533",
    "centerCode": "533",
    "centerName": "BMS Institute of Technology and Management",
    "cityId": "city-bengaluru",
    "address": "BMS Institute of Technology and Management, Bengaluru"
  },
  {
    "id": "center-646",
    "centerCode": "646",
    "centerName": "Rajarajeswari College of Engineering",
    "cityId": "city-bengaluru",
    "address": "Rajarajeswari College of Engineering, Bengaluru"
  },
  {
    "id": "center-42240",
    "centerCode": "42240",
    "centerName": "Harsha Institute of Technology",
    "cityId": "city-bengaluru",
    "address": "Harsha Institute of Technology, Bengaluru"
  },
  {
    "id": "center-193",
    "centerCode": "193",
    "centerName": "Amruta Institute of Engineering and Management Sciences",
    "cityId": "city-bengaluru",
    "address": "Amruta Institute of Engineering and Management Sciences, Bengaluru"
  },
  {
    "id": "center-2180",
    "centerCode": "2180",
    "centerName": "Don Bosco Institute of Technology",
    "cityId": "city-bengaluru",
    "address": "Don Bosco Institute of Technology, Bengaluru"
  },
  {
    "id": "center-972",
    "centerCode": "972",
    "centerName": "Jyothy Institute of Technology",
    "cityId": "city-bengaluru",
    "address": "Jyothy Institute of Technology, Bengaluru"
  },
  {
    "id": "center-506",
    "centerCode": "506",
    "centerName": "Global Academy of Technology",
    "cityId": "city-bengaluru",
    "address": "Global Academy of Technology, Bengaluru"
  },
  {
    "id": "center-3424",
    "centerCode": "3424",
    "centerName": "Dayananda Sagar Institutions",
    "cityId": "city-bengaluru",
    "address": "Dayananda Sagar Institutions, Bengaluru"
  },
  {
    "id": "center-42241",
    "centerCode": "42241",
    "centerName": "Akash Institute of Engineering and Technology",
    "cityId": "city-bengaluru",
    "address": "Akash Institute of Engineering and Technology, Bengaluru"
  },
  {
    "id": "center-755",
    "centerCode": "755",
    "centerName": "JSS Academy of Technical Education",
    "cityId": "city-bengaluru",
    "address": "JSS Academy of Technical Education, Bengaluru"
  },
  {
    "id": "center-596",
    "centerCode": "596",
    "centerName": "K S Institute of Technology",
    "cityId": "city-bengaluru",
    "address": "K S Institute of Technology, Bengaluru"
  },
  {
    "id": "center-986",
    "centerCode": "986",
    "centerName": "R.L.Jalappa Institute of Technology",
    "cityId": "city-bengaluru",
    "address": "R.L.Jalappa Institute of Technology, Bengaluru"
  },
  {
    "id": "center-4553",
    "centerCode": "4553",
    "centerName": "Alliance University",
    "cityId": "city-bengaluru",
    "address": "Alliance University, Bengaluru"
  },
  {
    "id": "center-42242",
    "centerCode": "42242",
    "centerName": "Aditya College of Engineering and Technology Bengaluru",
    "cityId": "city-bengaluru",
    "address": "Aditya College of Engineering and Technology Bengaluru, Bengaluru"
  },
  {
    "id": "center-2035",
    "centerCode": "2035",
    "centerName": "Nagarjuna College of Engineering & Technology",
    "cityId": "city-bengaluru",
    "address": "Nagarjuna College of Engineering & Technology, Bengaluru"
  },
  {
    "id": "center-3620",
    "centerCode": "3620",
    "centerName": "M S Ramaiah Institute of Technology",
    "cityId": "city-bengaluru",
    "address": "M S Ramaiah Institute of Technology, Bengaluru"
  },
  {
    "id": "center-7856",
    "centerCode": "7856",
    "centerName": "Sir M Visvesvaraya Institute Of Technology",
    "cityId": "city-bengaluru",
    "address": "Sir M Visvesvaraya Institute Of Technology, Bengaluru"
  },
  {
    "id": "center-29030",
    "centerCode": "29030",
    "centerName": "RV Institute of Technology and Management",
    "cityId": "city-bengaluru",
    "address": "RV Institute of Technology and Management, Bengaluru"
  },
  {
    "id": "center-1577",
    "centerCode": "1577",
    "centerName": "Sri Sairam College of Engineering",
    "cityId": "city-bengaluru",
    "address": "Sri Sairam College of Engineering, Bengaluru"
  },
  {
    "id": "center-42239",
    "centerCode": "42239",
    "centerName": "Dr. H N National College of Engineering",
    "cityId": "city-bengaluru",
    "address": "Dr. H N National College of Engineering, Bengaluru"
  },
  {
    "id": "center-40800",
    "centerCode": "40800",
    "centerName": "Lingarajappa Engineering College",
    "cityId": "city-bidar",
    "address": "Lingarajappa Engineering College, Bidar"
  },
  {
    "id": "center-195",
    "centerCode": "195",
    "centerName": "Sri Jagadguru Chandrashekaranatha Swamiji Institute of Technology",
    "cityId": "city-chikballapur",
    "address": "Sri Jagadguru Chandrashekaranatha Swamiji Institute of Technology, Chikballapur"
  },
  {
    "id": "center-1074",
    "centerCode": "1074",
    "centerName": "Adichunchanagiri Institute of Technology",
    "cityId": "city-chikkamagaluru",
    "address": "Adichunchanagiri Institute of Technology, Chikkamagaluru"
  },
  {
    "id": "center-201",
    "centerCode": "201",
    "centerName": "Bapuji Institute of Engineering & Technology",
    "cityId": "city-davanagere",
    "address": "Bapuji Institute of Engineering & Technology, Davanagere"
  },
  {
    "id": "center-7844",
    "centerCode": "7844",
    "centerName": "Jain Institute of Technology",
    "cityId": "city-davanagere",
    "address": "Jain Institute of Technology, Davanagere"
  },
  {
    "id": "center-974",
    "centerCode": "974",
    "centerName": "GM Institute of Technology",
    "cityId": "city-davanagere",
    "address": "GM Institute of Technology, Davanagere"
  },
  {
    "id": "center-1575",
    "centerCode": "1575",
    "centerName": "Global Business School",
    "cityId": "city-dharwad",
    "address": "Global Business School, Dharwad"
  },
  {
    "id": "center-1208",
    "centerCode": "1208",
    "centerName": "Sri Dharmasthala Manjunatheshwara College of Engineering and Technology",
    "cityId": "city-dharwad",
    "address": "Sri Dharmasthala Manjunatheshwara College of Engineering and Technology, Dharwad"
  },
  {
    "id": "center-985",
    "centerCode": "985",
    "centerName": "Smt. Kamala and Sri Venkappa M. Agadi College of Engineering and Technology",
    "cityId": "city-gadag",
    "address": "Smt. Kamala and Sri Venkappa M. Agadi College of Engineering and Technology, Gadag"
  },
  {
    "id": "center-8152",
    "centerCode": "8152",
    "centerName": "Rajeev Polytechnic",
    "cityId": "city-hassan",
    "address": "Rajeev Polytechnic, Hassan"
  },
  {
    "id": "center-1026",
    "centerCode": "1026",
    "centerName": "Malnad College of Engineering",
    "cityId": "city-hassan",
    "address": "Malnad College of Engineering, Hassan"
  },
  {
    "id": "center-2670",
    "centerCode": "2670",
    "centerName": "NAVKIS College of Engineering",
    "cityId": "city-hassan",
    "address": "NAVKIS College of Engineering, Hassan"
  },
  {
    "id": "center-950",
    "centerCode": "950",
    "centerName": "Sri Taralabalu Jagadguru Institute of Technology",
    "cityId": "city-haveri",
    "address": "Sri Taralabalu Jagadguru Institute of Technology, Haveri"
  },
  {
    "id": "center-2630",
    "centerCode": "2630",
    "centerName": "Proudadevaraya Institute of Technology",
    "cityId": "city-hospet",
    "address": "Proudadevaraya Institute of Technology, HOSPET"
  },
  {
    "id": "center-8030",
    "centerCode": "8030",
    "centerName": "iON Digital Zone iDZ Akshay Colony",
    "cityId": "city-hubballi-hubli-",
    "address": "iON Digital Zone iDZ Akshay Colony, Hubballi(Hubli)"
  },
  {
    "id": "center-9687",
    "centerCode": "9687",
    "centerName": "Chetan Business School",
    "cityId": "city-hubballi-hubli-",
    "address": "Chetan Business School, Hubballi(Hubli)"
  },
  {
    "id": "center-4521",
    "centerCode": "4521",
    "centerName": "AGMR College of Engineering and Technology",
    "cityId": "city-hubballi-hubli-",
    "address": "AGMR College of Engineering and Technology, Hubballi(Hubli)"
  },
  {
    "id": "center-9558",
    "centerCode": "9558",
    "centerName": "Jain College Of Engineering And Technology Hubballi",
    "cityId": "city-hubballi-hubli-",
    "address": "Jain College Of Engineering And Technology Hubballi, Hubballi(Hubli)"
  },
  {
    "id": "center-40041",
    "centerCode": "40041",
    "centerName": "Sharanabasaweshwar Vidya Vardhak Sangha",
    "cityId": "city-kalaburagi-gulbarga-",
    "address": "Sharanabasaweshwar Vidya Vardhak Sangha, Kalaburagi(Gulbarga)"
  },
  {
    "id": "center-26845",
    "centerCode": "26845",
    "centerName": "Godutai Engineering College For Women",
    "cityId": "city-kalaburagi-gulbarga-",
    "address": "Godutai Engineering College For Women, Kalaburagi(Gulbarga)"
  },
  {
    "id": "center-3194",
    "centerCode": "3194",
    "centerName": "Appa Institute Of Engineering & Technology",
    "cityId": "city-kalaburagi-gulbarga-",
    "address": "Appa Institute Of Engineering & Technology, Kalaburagi(Gulbarga)"
  },
  {
    "id": "center-920",
    "centerCode": "920",
    "centerName": "Dr T Thimmaiah Institute of Technology",
    "cityId": "city-kolar",
    "address": "Dr T Thimmaiah Institute of Technology, Kolar"
  },
  {
    "id": "center-3348",
    "centerCode": "3348",
    "centerName": "C Byre Gowda Institute of Technology",
    "cityId": "city-kolar",
    "address": "C Byre Gowda Institute of Technology, Kolar"
  },
  {
    "id": "center-973",
    "centerCode": "973",
    "centerName": "P.E.S College of Engineering",
    "cityId": "city-mandya",
    "address": "P.E.S College of Engineering, Mandya"
  },
  {
    "id": "center-1045",
    "centerCode": "1045",
    "centerName": "BGS Institute of Technology",
    "cityId": "city-mandya",
    "address": "BGS Institute of Technology, Mandya"
  },
  {
    "id": "center-8972",
    "centerCode": "8972",
    "centerName": "Cauvery Institute and Technology",
    "cityId": "city-mandya",
    "address": "Cauvery Institute and Technology, Mandya"
  },
  {
    "id": "center-1013",
    "centerCode": "1013",
    "centerName": "Maharaja Institute of Technology",
    "cityId": "city-mandya",
    "address": "Maharaja Institute of Technology, Mandya"
  },
  {
    "id": "center-8154",
    "centerCode": "8154",
    "centerName": "G.Madegowda Institute of Technology",
    "cityId": "city-mandya",
    "address": "G.Madegowda Institute of Technology, Mandya"
  },
  {
    "id": "center-8594",
    "centerCode": "8594",
    "centerName": "iON Digital Zone Bondel",
    "cityId": "city-mangaluru-mangalore-",
    "address": "iON Digital Zone Bondel, Mangaluru(Mangalore)"
  },
  {
    "id": "center-37202",
    "centerCode": "37202",
    "centerName": "Shri Sharada Niketana Exam and Training Institute",
    "cityId": "city-mangaluru-mangalore-",
    "address": "Shri Sharada Niketana Exam and Training Institute, Mangaluru(Mangalore)"
  },
  {
    "id": "center-192",
    "centerCode": "192",
    "centerName": "St Joseph Engineering College",
    "cityId": "city-mangaluru-mangalore-",
    "address": "St Joseph Engineering College, Mangaluru(Mangalore)"
  },
  {
    "id": "center-841",
    "centerCode": "841",
    "centerName": "Sahyadri College of Engineering and Management",
    "cityId": "city-mangaluru-mangalore-",
    "address": "Sahyadri College of Engineering and Management, Mangaluru(Mangalore)"
  },
  {
    "id": "center-784",
    "centerCode": "784",
    "centerName": "Mangalore Institute of Technology and Engineering",
    "cityId": "city-mangaluru-mangalore-",
    "address": "Mangalore Institute of Technology and Engineering, Mangaluru(Mangalore)"
  },
  {
    "id": "center-8975",
    "centerCode": "8975",
    "centerName": "Yenepoya Institute of Technology",
    "cityId": "city-mangaluru-mangalore-",
    "address": "Yenepoya Institute of Technology, Mangaluru(Mangalore)"
  },
  {
    "id": "center-8362",
    "centerCode": "8362",
    "centerName": "Shree Devi Institue of Technology",
    "cityId": "city-mangaluru-mangalore-",
    "address": "Shree Devi Institue of Technology, Mangaluru(Mangalore)"
  },
  {
    "id": "center-8743",
    "centerCode": "8743",
    "centerName": "iON Digital Zone iDZ Hebbal",
    "cityId": "city-mysuru-mysore-",
    "address": "iON Digital Zone iDZ Hebbal, Mysuru(Mysore)"
  },
  {
    "id": "center-11674",
    "centerCode": "11674",
    "centerName": "Chandana Resource Centre",
    "cityId": "city-mysuru-mysore-",
    "address": "Chandana Resource Centre, Mysuru(Mysore)"
  },
  {
    "id": "center-984",
    "centerCode": "984",
    "centerName": "Vidya Vardhaka College Of Engineering",
    "cityId": "city-mysuru-mysore-",
    "address": "Vidya Vardhaka College Of Engineering, Mysuru(Mysore)"
  },
  {
    "id": "center-42237",
    "centerCode": "42237",
    "centerName": "Cauvery College of Engineering",
    "cityId": "city-mysuru-mysore-",
    "address": "Cauvery College of Engineering, Mysuru(Mysore)"
  },
  {
    "id": "center-2678",
    "centerCode": "2678",
    "centerName": "GSSS Institute of Engineering and Technology for Women",
    "cityId": "city-mysuru-mysore-",
    "address": "GSSS Institute of Engineering and Technology for Women, Mysuru(Mysore)"
  },
  {
    "id": "center-16702",
    "centerCode": "16702",
    "centerName": "MIT Thandavapura",
    "cityId": "city-mysuru-mysore-",
    "address": "MIT Thandavapura, Mysuru(Mysore)"
  },
  {
    "id": "center-1465",
    "centerCode": "1465",
    "centerName": "Vivekananda College of Engineering & Technology",
    "cityId": "city-puttur",
    "address": "Vivekananda College of Engineering & Technology, Puttur"
  },
  {
    "id": "center-8560",
    "centerCode": "8560",
    "centerName": "iON Digital Zone iDZ Machenahalli",
    "cityId": "city-shivamogga-shimoga-",
    "address": "iON Digital Zone iDZ Machenahalli, Shivamogga(Shimoga)"
  },
  {
    "id": "center-971",
    "centerCode": "971",
    "centerName": "PES Institute of Technology and Management",
    "cityId": "city-shivamogga-shimoga-",
    "address": "PES Institute of Technology and Management, Shivamogga(Shimoga)"
  },
  {
    "id": "center-356",
    "centerCode": "356",
    "centerName": "Jawaharlal Nehru National College of Engineering",
    "cityId": "city-shivamogga-shimoga-",
    "address": "Jawaharlal Nehru National College of Engineering, Shivamogga(Shimoga)"
  },
  {
    "id": "center-207",
    "centerCode": "207",
    "centerName": "Siddaganga Institute of Technology",
    "cityId": "city-tumkur",
    "address": "Siddaganga Institute of Technology, Tumkur"
  },
  {
    "id": "center-1014",
    "centerCode": "1014",
    "centerName": "Channabasaveshwara Institute of Technology",
    "cityId": "city-tumkur",
    "address": "Channabasaveshwara Institute of Technology, Tumkur"
  },
  {
    "id": "center-2077",
    "centerCode": "2077",
    "centerName": "Shridevi Institute of Engineering & Technology",
    "cityId": "city-tumkur",
    "address": "Shridevi Institute of Engineering & Technology, Tumkur"
  },
  {
    "id": "center-7975",
    "centerCode": "7975",
    "centerName": "iON Digital Zone iDZ Milk Diary Road",
    "cityId": "city-udupi",
    "address": "iON Digital Zone iDZ Milk Diary Road, Udupi"
  },
  {
    "id": "center-1449",
    "centerCode": "1449",
    "centerName": "Shri Madhwa Vadiraja Institute of Technology & Management",
    "cityId": "city-udupi",
    "address": "Shri Madhwa Vadiraja Institute of Technology & Management, Udupi"
  },
  {
    "id": "center-15832",
    "centerCode": "15832",
    "centerName": "Sri Bhuvanendra College",
    "cityId": "city-udupi",
    "address": "Sri Bhuvanendra College, Udupi"
  },
  {
    "id": "center-1655",
    "centerCode": "1655",
    "centerName": "Mahatma Gandhi Memorial College",
    "cityId": "city-udupi",
    "address": "Mahatma Gandhi Memorial College, Udupi"
  },
  {
    "id": "center-15019",
    "centerCode": "15019",
    "centerName": "Manipal Institute Of Technology",
    "cityId": "city-udupi",
    "address": "Manipal Institute Of Technology, Udupi"
  },
  {
    "id": "center-2548",
    "centerCode": "2548",
    "centerName": "K L S Vishwanathrao Deshpande Rural Institute of Technology",
    "cityId": "city-uttara-kannada",
    "address": "K L S Vishwanathrao Deshpande Rural Institute of Technology, Uttara Kannada"
  },
  {
    "id": "center-970",
    "centerCode": "970",
    "centerName": "Dr P G Halakatti College of Engineering and Technology",
    "cityId": "city-vijayapura-bijapur-",
    "address": "Dr P G Halakatti College of Engineering and Technology, Vijayapura(Bijapur)"
  }
];

export const INITIAL_EXAMS: MasterExamData[] = [
  { id: 'exam-neet', name: 'NEET', code: 'NEET', type: 'Exam' },
  { id: 'exam-jee-main', name: 'JEE Main', code: 'JEE', type: 'Exam' },
  { id: 'exam-jee-session-2', name: 'JEE Main 2026 Session 2', code: 'JEE-M-S2', type: 'Exam' },
  { id: 'exam-ugc-net', name: 'UGC NET', code: 'NET', type: 'Exam' },
  { id: 'exam-tcs', name: 'TCS', code: 'TCS', type: 'Exam' },
  { id: 'exam-ibps-po-mains', name: 'IBPS PO Mains 2026', code: 'IBPS-PO-M', type: 'Exam' },
  { id: 'exam-ssc-cgl', name: 'SSC CGL Tier 1 2026', code: 'SSC-CGL-26', type: 'Exam' },
  { id: 'exam-rrb-ntpc', name: 'RRB NTPC Phase 1', code: 'RRB-NTPC-01', type: 'Exam' },
  { id: 'exam-upsc-nda', name: 'UPSC NDA 2026', code: 'UPSC-NDA', type: 'Exam' },
  { id: 'exam-aiims-mock', name: 'AIIMS Mock', code: 'AIIMS', type: 'Mock' },
  { id: 'exam-gate-mock', name: 'GATE Mock', code: 'GATE', type: 'Mock' },
  { id: 'exam-mock-drill-2026', name: 'Mock Drill 2026', code: 'MOCK-DR-26', type: 'Mock' },
  { id: 'exam-national-mock-2026', name: 'National Mock Exam 2026', code: 'NAT-MOCK', type: 'Mock' },
];
