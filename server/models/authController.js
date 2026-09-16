// Keep the public user payload consistent wherever authentication succeeds.
export function sendAuthResponse(res, token, user) {
  res.status(200).json({
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });
}