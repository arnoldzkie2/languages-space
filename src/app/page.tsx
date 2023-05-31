import prisma from "../../prisma/prisma";
interface AppProps {
}

const App = async ({ }) => {

  const addUser = async (form: FormData) => {
    'use server'
    try {
      const existingUser = await prisma.user.findMany({
        where: {
          email: form.get('email')
        }
      })
      if(existingUser) return console.log('Email already exist!');
      const newUser = await prisma.user.create({
        data: {
          name: form.get('name'),
          email: form.get('email')
        }
      })
      console.log(newUser);
    } catch (error) {
    console.log(error);
       
    }
  }

  return (
    <div>
      <form action={addUser}>
        <input type="text" name="name" placeholder="name" />
        <input type="text" name="email" placeholder="email" />
        <button>Add User</button>
      </form>
    </div>
    );
};

export default App;
