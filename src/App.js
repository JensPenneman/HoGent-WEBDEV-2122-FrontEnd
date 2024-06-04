import "./App.css";
import {HashRouter as BrowserRouter, Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar";
import {AuthProvider} from "./contexts/AuthProvider";
import Error404 from "./pages/404";
import Login from "./pages/bestuur/login";
import Startpagina from "./pages/startpagina";
import Bestuur from "./pages/bestuur/bestuur";
import {BestuurProvider} from "./contexts/BestuurProvider";
import AddBestuurslidForm from "./pages/bestuur/addBestuurslidForm";
import EditBestuurslidForm from "./pages/bestuur/editBestuurslidForm";
import {Box} from "@mui/material";
import Bestuurstaken from "./pages/Bestuurstaken/bestuurstaken";
import {Fragment} from "react";
import {BestuurstaakProvider} from "./contexts/BestuurstaakProvider";
import BestuurstaakForm from "./pages/Bestuurstaken/bestuurstaakForm";
import {BestuurslidBestuurtaakProvider} from "./contexts/BestuurslidBestuurtaakProvider";
import PrivateRoute from "./components/PrivateRoute";
import AddBestuurstaakForm from "./pages/Bestuurstaken/addBestuurstaakForm";


function App() {
	return (<div>
		<BestuurslidBestuurtaakProvider>
			<AuthProvider>
				<BestuurProvider>
					<BestuurstaakProvider>
						<BrowserRouter>
							<Navbar />
							<Box sx={{my: 2}}>
								<Routes>
									<Route end path="*" element={<Error404 />} status={404} />
									<Route end path="/login" element={<Login />} />
									<Route index path="/" element={<Startpagina />} />
									<Route path="/bestuur">
										<Route path="" element={<Bestuur />} />
										<Route path="add" element={
											<PrivateRoute needsSiteAdmin>
												<Fragment>
													<Bestuur />
													<AddBestuurslidForm />
												</Fragment>
											</PrivateRoute>
										} />
										<Route path="edit/:id" element={
											<PrivateRoute needsSiteAdmin>
												<Fragment>
													<Bestuur />
													<EditBestuurslidForm />
												</Fragment>
											</PrivateRoute>
										} />
										<Route path="addTask/:id" element={
											<PrivateRoute needsSiteAdmin>
												<Fragment>
													<Bestuur />
													<AddBestuurstaakForm />
												</Fragment>
											</PrivateRoute>
										} />
									</Route>
									<Route path="/bestuurstaken">
										<Route path="" element={
											<PrivateRoute>
												<Bestuurstaken />
											</PrivateRoute>} />
										<Route path="add" element={
											<PrivateRoute needsSiteAdmin>
												<Fragment>
													<Bestuurstaken />
													<BestuurstaakForm />
												</Fragment>
											</PrivateRoute>
										} />
										<Route path="edit/:id" element={
											<PrivateRoute needsSiteAdmin>
												<Fragment>
													<Bestuurstaken />
													<BestuurstaakForm />
												</Fragment>
											</PrivateRoute>
										} />
									</Route>
								</Routes>
							</Box>
						</BrowserRouter>
					</BestuurstaakProvider>
				</BestuurProvider>
			</AuthProvider>
		</BestuurslidBestuurtaakProvider>
	</div>);
}

export default App;
