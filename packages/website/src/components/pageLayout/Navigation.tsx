import Image from 'next/image'
import constants from '../../constants/index'
import {
	Box,
	Flex,
	Text,
	IconButton,
	Button,
	Stack,
	Collapse,
	Icon,
	Popover,
	PopoverTrigger,
	PopoverContent,
	useColorModeValue,
	useBreakpointValue,
	useDisclosure,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { motion } from 'framer-motion'
import { navVariants } from '../../util/motion'
import Link from 'next/link'
interface NavItem {
	label: string
	href?: string
}

const NAV_ITEMS: Array<NavItem> = [
	{
		label: 'About Us',
		href: '/about',
	},
	{
		label: 'dApps',
		href: '/dapps',
	},
	{
		label: 'Rewards',
		href: '/rewards',
	},
	{
		label: 'Docs',
		href: constants.documentationUrl,
	},
	{
		label: 'Token',
		href: '/token',
	},
	{
		label: 'Blog',
		href: '/posts',
	},
]

export default function Navigation() {
	const { isOpen, onToggle } = useDisclosure()

	return (
		<motion.nav
			variants={navVariants}
			initial="hidden"
			whileInView="show"
			viewport={{
				once: true,
			}}>
			<Box>
				<Flex
					bg={'transparent'}
					color={useColorModeValue('gray.600', 'white')}
					minH={'60px'}
					align={'center'}
					justify={{
						base: 'space-between',
					}}>
					<Flex flex={{ base: 1 }} justify={{ base: 'start', md: 'start' }}>
						<Link href="/" className="cursor-pointer">
							<Box
								width={{
									base: '100px',
									md: '132px',
								}}
								height={{
									base: '20px',
									md: '24px',
								}}
								className="relative cursor-pointer">
								<Image alt="Diva Logo" src="/DIVALogo.png" fill />
							</Box>
						</Link>
					</Flex>
					<Flex ml={{ base: -2 }} display={{ base: 'flex', md: 'none' }}>
						<IconButton
							onClick={onToggle}
							icon={
								isOpen ? (
									<CloseIcon w={3} h={3} />
								) : (
									<HamburgerIcon w={5} h={5} />
								)
							}
							variant={'ghost'}
							aria-label={'Toggle Navigation'}
						/>
					</Flex>
					<Flex
						justify={'flex-end'}
						display={{ base: 'none', md: 'flex' }}
						ml={10}>
						<DesktopNav />
					</Flex>
				</Flex>

				<Collapse in={isOpen} animateOpacity>
					<MobileNav />
				</Collapse>
			</Box>
		</motion.nav>
	)
}

const DesktopNav = () => {
	return (
		<Stack direction={'row'} spacing={4}>
			{NAV_ITEMS.map((navItem) => (
				<Box key={navItem.label} className="text-[#f4f4f4] opacity-75">
					<Popover trigger={'hover'} placement={'bottom-start'}>
						<PopoverTrigger>
							<Link
								href={navItem.href ?? '#'}
								className="p-2 text-sm font-medium ">
								{navItem.label}
							</Link>
						</PopoverTrigger>
					</Popover>
				</Box>
			))}
		</Stack>
	)
}

const MobileNav = () => {
	return (
		<Stack
			bg={useColorModeValue('transparent', 'gray.800')}
			p={4}
			display={{ md: 'none' }}
			className="text-left text-[#f4f4f4] opacity-75 gap-3">
			{NAV_ITEMS.map((navItem) => (
				<MobileNavItem key={navItem.label} {...navItem} />
			))}
		</Stack>
	)
}

const MobileNavItem = ({ label, href }: NavItem) => {
	return (
		<Stack spacing={4}>
			<Flex
				as={Link}
				href={href ?? '#'}
				className="py-2 text-sm font-medium justify-center items-center gap-3">
				<Text fontWeight={600} color={useColorModeValue('white', 'gray.200')}>
					{label}
				</Text>
			</Flex>
		</Stack>
	)
}
