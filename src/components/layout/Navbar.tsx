import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Wallet, Menu } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"; // Added DialogDescription
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

// Define API base URL at the top (replace with your actual backend URL)
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // Fetch departments data on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${API_URL}/api/departments`);
        if (!response.ok) {
          throw new Error("Failed to fetch departments");
        }
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast({
          title: "Error",
          description: "Failed to load departments. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchDepartments();
  }, []);

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle email submission from the modal
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter a valid email.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/wallet/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch wallet data");
      }

      const data = await response.json();
      navigate("/wallet", { state: { email, walletData: data } });
      toast({
        title: "Success",
        description: `Wallet data loaded for ${email}.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      toast({
        title: "Error",
        description: "Failed to load wallet data. Please check if the backend server is running.",
        variant: "destructive",
      });
    }

    setEmailModalOpen(false);
    setEmail("");
  };

  return (
    <header className="bg-white dark:bg-[#0f172a] transition-all duration-300 shadow-sm sticky top-0 z-50">
      <div className="container-custom flex items-center justify-between h-16 px-4 sm:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-healthoasis-blue dark:text-blue-400">HealthOasis</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-healthoasis-blue dark:hover:text-blue-400 transition-colors font-medium">Home</Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-transparent hover:text-healthoasis-blue dark:text-gray-200 dark:hover:text-blue-400">
                  Departments
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {departments.length > 0 ? (
                      departments.map((dept) => (
                        <li key={dept.id}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={`/departments/${dept.name.toLowerCase()}`}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100"
                            >
                              <div className="text-sm font-medium leading-none">{dept.name}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-gray-600 dark:text-gray-400">{dept.description}</p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))
                    ) : (
                      <li>No departments available</li>
                    )}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-transparent hover:text-healthoasis-blue dark:text-gray-200 dark:hover:text-blue-400">
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/services/emergency-care" className="block select-none space-y-1 rounded-md p-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100">
                          <div className="text-sm font-medium leading-none">Emergency Care</div>
                          <p className="text-sm leading-snug text-gray-600 dark:text-gray-400">Immediate medical attention in critical situations.</p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/services/lab-tests" className="block select-none space-y-1 rounded-md p-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100">
                          <div className="text-sm font-medium leading-none">Lab Tests</div>
                          <p className="text-sm leading-snug text-gray-600 dark:text-gray-400">Comprehensive lab testing services available.</p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/services/medical-checkups" className="block select-none space-y-1 rounded-md p-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100">
                          <div className="text-sm font-medium leading-none">Medical Checkups</div>
                          <p className="text-sm leading-snug text-gray-600 dark:text-gray-400">Regular health evaluations to keep you well.</p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/services/vaccinations" className="block select-none space-y-1 rounded-md p-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100">
                          <div className="text-sm font-medium leading-none">Vaccinations</div>
                          <p className="text-sm leading-snug text-gray-600 dark:text-gray-400">Stay protected with routine immunizations.</p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Link to="/doctors" className="text-gray-700 dark:text-gray-200 hover:text-healthoasis-blue dark:hover:text-blue-400 transition-colors font-medium">Doctors</Link>
          <Link to="/contact" className="text-gray-700 dark:text-gray-200 hover:text-healthoasis-blue dark:hover:text-blue-400 transition-colors font-medium">Contact</Link>
        </nav>

        <button onClick={toggleMobileMenu} className="md:hidden p-2 text-gray-800 dark:text-white">
          <Menu size={24} />
        </button>

        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={() => setEmailModalOpen(true)}
            className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-full shadow-sm hover:shadow-md transition-all duration-300"
          >
            <Wallet size={20} className="text-green-600 transition-transform duration-300 hover:rotate-90" />
          </button>
          <Link to="/book-appointment" className="primary-button text-white bg-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 duration-300 ease-in-out text-center">
            Book Appointment
          </Link>
          <button onClick={toggleTheme} className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-full shadow-sm hover:shadow-md transition-all duration-300">
            {isDarkMode ? <Sun size={20} className="text-yellow-400 transition-transform duration-300 hover:rotate-90" /> : <Moon size={20} className="text-gray-700 transition-transform duration-300 hover:rotate-90" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-[#0f172a] px-4 py-4 space-y-4">
          <Link to="/" className="block text-gray-800 dark:text-white">Home</Link>
          <Link to="/departments" className="block text-gray-800 dark:text-white">Departments</Link>
          <Link to="/services" className="block text-gray-800 dark:text-white">Services</Link>
          <Link to="/doctors" className="block text-gray-800 dark:text-white">Doctors</Link>
          <Link to="/contact" className="block text-gray-800 dark:text-white">Contact</Link>
          <Link to="/wallet" className="block text-gray-800 dark:text-white">Wallet</Link>
          <Link to="/book-appointment" className="block text-blue-600 font-semibold">Book Appointment</Link>
        </div>
      )}

      <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Your Email</DialogTitle>
            <DialogDescription>Please enter your email to access your wallet data.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEmailSubmit}>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Navbar;