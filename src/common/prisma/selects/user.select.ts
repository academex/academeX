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
