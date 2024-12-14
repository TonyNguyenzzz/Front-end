// src/data/buildingsData.ts
interface Building {
  id: number;
  name: string;
  address: string;
  floors: number;
}

const buildingsData: Building[] = [
  { id: 1, name: 'Tòa Nhà A', address: '123 Đường ABC, Quận 1, TP.HCM', floors: 10 },
  { id: 2, name: 'Tòa Nhà B', address: '456 Đường DEF, Quận 2, TP.HCM', floors: 8 },
  { id: 3, name: 'Tòa Nhà C', address: '789 Đường GHI, Quận 3, TP.HCM', floors: 12 },
  { id: 4, name: 'Tòa Nhà D', address: '101 Đường JKL, Quận 4, TP.HCM', floors: 9 },
  { id: 5, name: 'Tòa Nhà E', address: '202 Đường MNO, Quận 5, TP.HCM', floors: 7 },
  { id: 6, name: 'Tòa Nhà F', address: '303 Đường PQR, Quận 6, TP.HCM', floors: 11 },
  { id: 7, name: 'Tòa Nhà G', address: '404 Đường STU, Quận 7, TP.HCM', floors: 10 },
  { id: 8, name: 'Tòa Nhà H', address: '505 Đường VWX, Quận 8, TP.HCM', floors: 8 },
  { id: 9, name: 'Tòa Nhà I', address: '606 Đường YZA, Quận 9, TP.HCM', floors: 13 },
  { id: 10, name: 'Tòa Nhà J', address: '707 Đường BCD, Quận 10, TP.HCM', floors: 9 },
  { id: 11, name: 'Tòa Nhà K', address: '808 Đường EFG, Quận 11, TP.HCM', floors: 14 },
  { id: 12, name: 'Tòa Nhà L', address: '909 Đường HIJ, Quận 12, TP.HCM', floors: 7 },
  { id: 13, name: 'Tòa Nhà M', address: '1010 Đường KLM, Quận 13, TP.HCM', floors: 10 },
  { id: 14, name: 'Tòa Nhà N', address: '1111 Đường NOP, Quận 14, TP.HCM', floors: 9 },
  { id: 15, name: 'Tòa Nhà O', address: '1212 Đường QRS, Quận 15, TP.HCM', floors: 8 },
  { id: 16, name: 'Tòa Nhà P', address: '1313 Đường TUV, Quận 16, TP.HCM', floors: 12 },
  { id: 17, name: 'Tòa Nhà Q', address: '1414 Đường WXY, Quận 17, TP.HCM', floors: 11 },
  { id: 18, name: 'Tòa Nhà R', address: '1515 Đường ZAB, Quận 18, TP.HCM', floors: 10 },
  { id: 19, name: 'Tòa Nhà S', address: '1616 Đường CDE, Quận 19, TP.HCM', floors: 9 },
  { id: 20, name: 'Tòa Nhà T', address: '1717 Đường FGH, Quận 20, TP.HCM', floors: 8 },
];

export default buildingsData;
