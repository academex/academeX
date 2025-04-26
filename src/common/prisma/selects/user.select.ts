export const baseUserSelect = {
  id: true,
  username: true,
  photoUrl: true,
  firstName: true,
  lastName: true,
} as const;

export const UserSelect = {
  id: true,
  username: true,
  photoUrl: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  phoneNum: true,
  status: true,
  nationalId: true,
  nationalIdPhotoUrl: true,
} as const;

export const UserProfileSelect = {
  id: true,
  username: true,
  photoUrl: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  phoneNum: true,
  status: true,
  nationalId: true,
  nationalIdPhotoUrl: true,
  bio: true,
  currentYear: true,
  gender: true,
  tag: {
    select: {
      name: true,
      collegeAr: true,
      collegeEn: true,
      majorAr: true,
      majorEn: true,
    },
  },
} as const;
