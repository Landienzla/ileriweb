import "./App.css";
import { Form, Button, Container, FloatingLabel, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import db from "./firebase";
import {
  doc,
  query,
  onSnapshot,
  where,
  getDocs,
  collection,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { PieChart } from "react-minimal-pie-chart";
import { VictoryPie, VictoryChart, VictoryHistogram } from "victory";
function App() {
  function Home() {
    const { register, handleSubmit, setValue } = useForm();
    async function onSubmit(data) {
      const q = query(
        collection(db, "users"),
        where("phoneNumber", "==", data.phone)
      );
      const querySnapshot = await getDocs(q);
      if (data.city !== "Şehir Seçiniz") {
        if (querySnapshot.empty) {
          const docRef = await addDoc(collection(db, "users"), {
            firstName: data.name,
            lastName: data.lastName,
            phoneNumber: data.phone,
            city: data.city,
          });
          setValue("city", "Şehir Seçiniz");
          setValue("name", "");
          setValue("lastName", "");
          setValue("phone", "");
          alert("Oyunuz Kaydedildi");
        } else {
          alert("Daha Önce Oy Kullandınız");
        }
      } else {
        alert("Şehir Seçiniz");
      }
    }
    const [cities, setCities] = useState([]);
    useEffect(() => {
      const q = query(collection(db, "cities"));
      const unsub = onSnapshot(q, (querySnapshot) => {
        setCities(querySnapshot.docs[0].data().cityList);
      });
    }, []);

    return (
      <Container className="App">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>İsim*</Form.Label>
            <Form.Control
              required
              placeholder="İsim"
              {...register("name", { required: "Lütfen Adınızı Giriniz" })}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicLastName">
            <Form.Label>Soyisim*</Form.Label>
            <Form.Control
              required
              placeholder="Soyisim"
              {...register("lastName", {
                required: "Lütfen Soyisminizi Giriniz",
              })}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Telefon Numarası*</Form.Label>
            <Form.Control
              maxLength={11}
              placeholder="Telefon Numarası"
              {...register("phone")}
            />
          </Form.Group>
          <Form.Select
            aria-label="Default select example"
            {...register("city")}
          >
            <option>Şehir Seçiniz</option>
            {cities.map((city) => {
              return <option>{city}</option>;
            })}
          </Form.Select>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    );
  }
  function Admin() {
    const { register, handleSubmit, setValue } = useForm();
    const [user, setUser] = useState(null);
    const [data, setData] = useState();
    const [ankara, setAnkara] = useState(0);
    const [izmir, setIzmir] = useState(0);
    const [istanbul, setIstanbul] = useState(0);
    const [antalya, setAntalya] = useState(0);
    async function onSubmit(data) {
      const q = query(
        collection(db, "admins"),
        where("username", "==", data.username)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        if (querySnapshot.docs[0].data().password === data.password) {
          setUser(querySnapshot.docs[0].data());
        } else {
          alert("Hatalı Şifre");
        }
      } else {
        alert("Hatalı Kullanıcı Adı");
      }
    }
    useEffect(() => {
      if (user) {
        let arr = [];
        const q = query(collection(db, "users"));
        getDocs(q).then((querySnapshot) => {
          querySnapshot.docs.forEach((doc) => {
            arr.push(doc.data());
          });
          setData(arr);
        });
      }
    }, [user]);

    useEffect(() => {
      if (data && user) {
        let ankara = data.filter((item) => item.city === "ankara");
        let antalya = data.filter((item) => item.city === "antalya");
        let istanbul = data.filter((item) => item.city === "istanbul");
        let izmir = data.filter((item) => item.city === "izmir");
        setAnkara(ankara.length);
        setAntalya(antalya.length);
        setIstanbul(istanbul.length);
        setIzmir(izmir.length);
      }
    }, [data]);

    return (
      <Container className="App">
        <h1>Admin</h1>
        {user ? (
          <div>
            <Button onClick={() => setUser(null)}>Çıkış Yap</Button>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>İsim</th>
                  <th>Soyisim</th>
                  <th>Telefon Numarası</th>
                  <th>Şehir</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((user, index) => (
                    <>
                      <tr>
                        <td>{index + 1}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.phoneNumber}</td>
                        <td>{user.city}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </Table>
            <VictoryPie
              height={250}
              labels={({ datum }) => `${datum.x}: ${datum.y}`}
              animate
              style={{ width: 100, height: 100 }}
              padAngle={({ datum }) => datum.y}
              innerRadius={100}
              colorScale={["tomato", "orange", "gold", "cyan", "navy"]}
              data={[
                { x: "Ankara", y: ankara },
                { x: "Istanbul", y: istanbul },
                { x: "İzmir", y: izmir },
                { x: "Antalya", y: antalya },
              ]}
            />
            ;
          </div>
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FloatingLabel
              controlId="floatingInput"
              label="Username"
              className="mb-3"
            >
              <Form.Control
                type="username"
                placeholder="username"
                {...register("username")}
                required
              />
            </FloatingLabel>
            <FloatingLabel controlId="floatingPassword" label="Password">
              <Form.Control
                type="password"
                placeholder="Password"
                {...register("password")}
              />
            </FloatingLabel>
            <Button className="mt-3" type="submit">
              Login
            </Button>
          </Form>
        )}
      </Container>
    );
  }
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;
