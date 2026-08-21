export const SURNAMES = [
  "Nguyễn",
  "Trần",
  "Lê",
  "Phạm",
  "Hoàng",
  "Huỳnh",
  "Phan",
  "Vũ",
  "Võ",
  "Đặng",
  "Bùi",
  "Đỗ",
  "Hồ",
  "Ngô",
  "Dương",
  "Lý",
  "Đinh",
  "Trịnh",
  "Đào",
  "Lương",
];

export const MALE_GIVEN = [
  "Hùng",
  "Minh",
  "Đức",
  "Tuấn",
  "Nam",
  "Hải",
  "Phúc",
  "Long",
  "Khoa",
  "Bình",
  "Dũng",
  "Quang",
  "Thành",
  "Sơn",
  "Tài",
  "Lâm",
  "Khánh",
  "Phong",
  "Việt",
  "Cường",
  "Hoàng",
  "Tâm",
  "An",
  "Kiên",
  "Trung",
];

export const FEMALE_GIVEN = [
  "Lan",
  "Mai",
  "Hoa",
  "Hương",
  "Ngọc",
  "Hồng",
  "Thảo",
  "Linh",
  "Yến",
  "Hà",
  "Trang",
  "Vy",
  "Nhung",
  "Diệu",
  "Thúy",
  "Oanh",
  "Tuyết",
  "Hạnh",
  "Quỳnh",
  "Giang",
  "My",
  "Châu",
  "Thư",
  "An",
  "Duyên",
];

export const MIDDLE_MALE = ["Văn", "Hữu", "Đình", "Công", "Quốc"];
export const MIDDLE_FEMALE = ["Thị", "Ngọc", "Thu", "Kim", "Minh"];

export const KINSHIP = [
  "bà Năm",
  "ông Tư",
  "bác Sáu",
  "cô Bảy",
  "chú Tám",
  "dì Tư",
  "cậu Chín",
  "mợ Ba",
  "thím Năm",
  "cụ Đinh",
  "cụ Sáu",
  "anh Hai",
  "chị Ba",
  "út Bảy",
];

export function fullName(surname: string, middle: string, given: string) {
  return `${surname} ${middle} ${given}`;
}

export function pick<T>(list: T[], seed: number): T {
  return list[Math.abs(seed) % list.length]!;
}

export function maleName(seed: number): string {
  return fullName(
    pick(SURNAMES, seed),
    pick(MIDDLE_MALE, seed >> 3),
    pick(MALE_GIVEN, seed >> 5),
  );
}

export function femaleName(seed: number): string {
  return fullName(
    pick(SURNAMES, seed + 7),
    pick(MIDDLE_FEMALE, seed >> 2),
    pick(FEMALE_GIVEN, seed >> 4),
  );
}
