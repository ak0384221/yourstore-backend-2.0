import bcrypt from "bcrypt";

//validating pass

async function isPasswordCorrect(user, pass) {
  return await bcrypt.compare(pass, user.password);
}

export { isPasswordCorrect };
