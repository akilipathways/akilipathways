import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Assessment', path: '/assessment' },
        { name: 'Schools', path: '/schools' },
    ];

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="bg-primary-blue text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-display font-bold">Akili Pathways<sup className="text-xs">TM</sup></span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-accent-orange",
                                    location.pathname === item.path ? "text-accent-orange" : "text-white"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="flex items-center space-x-4">
                            <Link to="/login">
                                <Button variant="ghost" className="text-white hover:text-accent-orange hover:bg-white/10">
                                    Log In
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button variant="accent">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="p-2 rounded-md hover:bg-white/10 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-primary-blue border-t border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={cn(
                                    "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                                    location.pathname === item.path ? "bg-white/10 text-accent-orange" : "text-white hover:bg-white/5 hover:text-accent-orange"
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="pt-4 pb-2 border-t border-white/10 mt-4 flex flex-col space-y-2 px-3">
                            <Link to="/login" onClick={() => setIsOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start text-white hover:text-accent-orange hover:bg-white/10">
                                    Log In
                                </Button>
                            </Link>
                            <Link to="/signup" onClick={() => setIsOpen(false)}>
                                <Button variant="accent" className="w-full">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
