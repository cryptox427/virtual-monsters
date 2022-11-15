import { useState, useRef, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import Modal from 'react-modal'
import { ethers } from "ethers";
import Web3 from 'web3';

import { injected, walletconnector, bsc } from './utils/connector'
import { wallets } from './components/constants'

import './App.css';
import './style.css';

import { ToastsContainer, ToastsStore } from 'react-toasts';


import $ from 'jquery';
import { Chart } from "react-google-charts";
import pdf from './assets/whitepaper.pdf'
import 'swiper/swiper.min.css'
import 'swiper/modules/pagination/pagination.min.css'

import VMonstersABI from "./contracts/VirtualMonsters.json";

const Cancel = 'images/cancel.svg';
const VMonsterAddress = "0xc777950A5Df2aEb89543145628E33679a0A9E53B";





function App() {
  const [isOpen, setOpen] = useState(false);
  const [mintAmount, setMintAmount] = useState(0);
  const [mintState, setMintState] = useState(false);

  const { account, chainId, activate, deactivate } = useWeb3React();

  //if mintstep is 1, it is presale. else that is 2 it is public sale.
  const [mintStep, setMintStep] = useState(1);




  const swiperRef = useRef(null)
  const navItems = [
    { name: 'About', id: 'about' },
    { name: 'NFTs', id: 'nfts' },
    { name: 'Tokenomics', id: 'tokenomics' },
    // {name: 'Roadmap', id: 'roadmap'},
    { name: 'Swap', id: 'swap' },
    { name: 'NFT Staking', id: 'nft_staking' },
    { name: 'Team', id: 'team' },
    { name: 'Partners', id: 'partners' },
  ]

  useEffect(() => {
    cardEffect()
  }, [])

  const cardEffect = () => {
    /*

  using
    - an animated gif of sparkles.
    - an animated gradient as a holo effect.
    - color-dodge mix blend mode

*/
    var x;
    var $cards = $(".card");
    var $style = $(".hover");

    $cards
      .on("mousemove touchmove", function (e) {
        // normalise touch/mouse
        var pos = [e.offsetX, e.offsetY];
        e.preventDefault();
        if (e.type === "touchmove") {
          pos = [e.touches[0].clientX, e.touches[0].clientY];
        }
        var $card = $(this);
        // math for mouse position
        var l = pos[0];
        var t = pos[1];
        var h = $card.height();
        var w = $card.width();
        var px = Math.abs(Math.floor(100 / w * l) - 100);
        var py = Math.abs(Math.floor(100 / h * t) - 100);
        var pa = (50 - px) + (50 - py);
        // math for gradient / background positions
        var lp = (50 + (px - 50) / 1.5);
        var tp = (50 + (py - 50) / 1.5);
        var px_spark = (50 + (px - 50) / 7);
        var py_spark = (50 + (py - 50) / 7);
        var p_opc = 20 + (Math.abs(pa) * 1.5);
        var ty = ((tp - 50) / 2) * -1;
        var tx = ((lp - 50) / 1.5) * .5;
        // css to apply for active card
        var grad_pos = `background-position: ${lp}% ${tp}%;`
        var sprk_pos = `background-position: ${px_spark}% ${py_spark}%;`
        var opc = `opacity: ${p_opc / 100};`
        var tf = `transform: rotateX(${ty}deg) rotateY(${tx}deg)`
        // need to use a <style> tag for psuedo elements
        var style = `
      .card:hover:before { ${grad_pos} }  /* gradient */
      .card:hover:after { ${sprk_pos} ${opc} }   /* sparkles */ 
    `
        // set / apply css class and style
        $cards.removeClass("active");
        $card.removeClass("animated");
        $card.attr("style", tf);
        $style.html(style);
        if (e.type === "touchmove") {
          return false;
        }
        clearTimeout(x);
      }).on("mouseout touchend touchcancel", function () {
        // remove css, apply custom animation on end
        var $card = $(this);
        $style.html("");
        $card.removeAttr("style");
        x = setTimeout(function () {
          $card.addClass("animated");
        }, 2500);
      });
  }


  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '20%',
      height: '300px',
      borderRadius: '15px',
      background: 'rgba(0, 0, 0, 0.95)',
      paddingTop: '10px',
      minWidth: '250px',
    },
  }

  const data = [
    ["Task", "Hours per Day"],
    ["MINER REWARDS", 10],
    ["NFT YIELD REWARDS", 15],
    ["CEX", 10],
    ["TEAM", 5],
    ["LISTING", 24.7],
    ["PRESALE", 35.3],
  ];
  const options = {
    is3D: true,
    backgroundColor: 'transparent',
    slices: {
      0: { color: '#581557' },
      1: { color: '#3d006f' },
      2: { color: '#C60961' },
      3: { color: '#6D0022' },
      4: { color: '#61cdff' },
    },
    legend: { position: 'right', textStyle: { color: 'white', fontSize: 16, fontFamily: 'Futura' } }
  };

  const onClickNav = (id) => {
    setOpen(false)
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const onOpenWhitepaper = () => {
    window.open(pdf, '_blank')
  }

  const walletModalOpen = async () => {
    setOpen(true);
  }

  const walletDisconnect = async () => {
    deactivate();
  }

  const closeModal = () => {
    setOpen(false)
  }

  const handleLogin = async (wname) => {
    let sign = 1;
    if (wname === 'Wallet Connect') {
      activate(walletconnector);
    } else if (wname === 'Binance Wallet') {
      activate(bsc)
    } else if (wname === 'Metamask') {
      await activate(injected);
    } else {
      ToastsStore.error("This supports only Metamask and Wallet Connect");
    }
    setOpen(false)
  }

  const subMintNumber = async () => {
    if (mintAmount - 1 <= 0)
      setMintAmount(0);
    else
      setMintAmount(mintAmount - 1);
  }

  const addMintNumber = async () => {
    // if(mintAmount >= 2)
    //   setMintAmount(2);
    // else
    setMintAmount(mintAmount + 1);
  }

  const mintNow = async () => {
    const { ethereum } = window;
    if (mintState) {
      ToastsStore.error("Transaction is performing now. Please wait and try again");
      return;
    }
    if (ethereum) {
      var provider = new ethers.providers.Web3Provider(ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        const { chainId } = await provider.getNetwork();
        if (chainId !== 0x5) {
          return;
        }
        setMintState(true);

        const signer = provider.getSigner();
        const VMonsterContract = new ethers.Contract(VMonsterAddress, VMonstersABI, signer);
        const presalePrice = await VMonsterContract.presalePrice();
        const mintPrice = await VMonsterContract.mintPrice();


        if (mintStep == 1) 
        {
          let price = mintAmount * presalePrice;

          try {
            const nftTxn = await VMonsterContract.mintPresale(mintAmount, { value: `${price}` });
            ToastsStore.success("Minting...please wait.")
            await nftTxn.wait();
            ToastsStore.success(`Minted, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);
          } catch (e) {
            console.log(e)
            ToastsStore.error("Sorry. Error occured")
            return;
          }
        }
        else {
          let price = mintAmount * mintPrice;
          
          try {
            const nftTxn = await VMonsterContract.mintPublic(mintAmount, { value: `${price}` });
            ToastsStore.success("Minting...please wait.")
            await nftTxn.wait();
            ToastsStore.success(`Minted, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);
          } catch (e) {
            console.log(e)
            ToastsStore.error("Sorry. Error occured")
            return;
          }
        }
        ToastsStore.success("NFT minting successed!");
      } else {
        ToastsStore.error("Please connect the wallet");
      }
    } else {
      ToastsStore.error("Please install Metamask!");
    }
    setMintState(false);
  }


  return (
    <div className={'background overflow-y-scroll'}>
      <nav className={'py-5 hidden xl:flex justify-between items-center  px-3 z-10'}>
        <img
          src={require('./assets/images/logo.png').default} className={'w-12 object-contain'} />
        <div className={'flex items-center'}>
          <ul className={'flex space-x-7 mr-10'}>
            {navItems.map((item, i) => <li onClick={() => onClickNav(item.id)}
              className={'text-white uppercase text-xs text-white hover:text-gray-100 cursor-pointer'}><a
                href={'#' + item.id}>{item.name}</a></li>)}
          </ul>
          <div className={'flex items-center space-x-7'}>
            <a><img src={require('./assets/images/icon-discord.svg').default} alt={''} /> </a>
            <a><img src={require('./assets/images/icon-twitter.svg').default} alt={''} /> </a>

            {!account ? (
              <button onClick={walletModalOpen} className={'flex justify-center items-center rounded-full px-6 py-2 text-sm text-white relative h-10'}>
                <img src={require('./assets/images/btn.png').default} className={'absolute h-14 w-48'} style={{ zIndex: -1 }} />
                CONNECT WALLET
              </button>
            ) : (
              <button onClick={walletDisconnect} className={'flex justify-center items-center rounded-full px-6 py-2 text-sm text-white relative h-10'}>
                <img src={require('./assets/images/btn.png').default} className={'absolute h-14 w-48'} style={{ zIndex: -1 }} />
                {account.slice(0, 9) + '...' + account.slice(account.length - 7, account.length)}
              </button>
            )}

          </div>
        </div>
      </nav>
      <nav className={'px-5 py-2 items-center xl:hidden'} style={{ backgroundColor: 'rgba(0,0,0, .6)' }}>
        <div className={'flex justify-between items-center'}>
          <img
            src={require('./assets/images/logo.png').default} className={'w-12 object-contain'} />
          <a className={'border border-gray-500 px-4 py-2 rounded-md cursor-pointer'} onClick={() => setOpen(!isOpen)}>
            <img src={require('./assets/images/menu-icon.svg').default} alt={''} className={'w-4'} />
          </a>
        </div>
        {isOpen && <ul className={'flex flex-col space-y-3 mt-4'}>
          {navItems.map((item, i) => <li
            className={'text-white uppercase text-xs text-white hover:text-gray-100 cursor-pointer'}><a onClick={() => onClickNav(item.id)}
              href={'#' + item.id}>{item.name}</a></li>)}
        </ul>}
        {isOpen && <div className={'flex items-center space-x-10 mt-4 mb-4'}>
          <a><img src={require('./assets/images/icon-discord.svg').default} alt={''} /> </a>
          <a><img src={require('./assets/images/icon-twitter.svg').default} alt={''} /> </a>


          <button className={'flex justify-center items-center rounded-full px-6 py-2 text-sm text-white relative h-10'}>
            <img src={require('./assets/images/btn.png').default} className={'absolute h-14 w-48'} style={{ zIndex: -1 }} />
            CONNECT
            WALLET
          </button>

        </div>}
      </nav>
      <div>
        <div>
          <div className={'grid grid-cols-1 order-last lg:order-start lg:grid-cols-2 px-2 sm:px-16 mt-28'}>
            <div className={'order-last lg:order-first'}>
              <div className={'text-4xl mt-4 sm:mt-0 sm:text-8xl text-white font-semibold text-center xl:text-left'}>Virtual Monsters</div>
              <div className={'text-base text-indigo-100 mt-10 tracking-wide text-center xl:text-left'}>
                Raising Your Own Best Friend with WEB3 powered
                by Non-Fungible Token.
              </div>
              <div className={'space-y-3 mt-10'}>
                <div className={'flex flex-col sm:flex-row space-y-8 md:space-y-0 space-x-0 md:space-x-4 items-center justify-center xl:justify-start'}>
                  <button className={'flex justify-center items-center rounded-full px-6 py-2 text-sm text-white relative h-10 w-48 cta-button'}>
                    <img src={require('./assets/images/btn.png').default} className={'absolute h-16 w-48'} style={{ zIndex: -1 }} />
                    <div>GET $VIGIMON</div>
                  </button>
                  <button onClick={onOpenWhitepaper} className={'flex justify-center items-center rounded-full px-6 py-2 text-sm text-white relative h-10 w-48 cta-button'}>
                    <img src={require('./assets/images/btn.png').default} className={'absolute h-16 w-48'} style={{ zIndex: -1 }} />
                    <div>WHITE PAPER</div>
                  </button>
                </div>
              </div>
            </div>
            <div className={'flex items-start justify-center xl:justify-start space-x-6 relative order-first lg:order-last'}>
              <img src={require('./assets/images/planet.png').default} className={'w-64 h-40 hidden md:block object-contain'} />
            </div>
          </div>
        </div>
        <div className={'flex justify-center items-center py-3 space-x-4 my-20'}>
          <div className={'text-4xl font-semibold text-white'}>Web3 Virtual Pets</div>
        </div>
      </div>
      <div className={'space-y-10 mt-10'} id={'about'}>
        <div className={'flex justify-center items-center text-5xl font-semibold text-white'}>ABOUT</div>
        <div className={'grid grid-cols-1 lg:grid-cols-2 gap-4 h-full w-full'}>
          <img src={require('./assets/images/pet3.png').default} className={'mx-auto h-56 sm:h-96 w-56 sm:w-96 object-contain'} />
          <div className={'flex flex-col justify-start mt-10 space-y-5 w-full px-2 sm:px-20 lg:px-0 lg:w-96 text-center lg:text-left'}>
            <div className={'text-white text-5xl'}>Why Virtual Monsters?</div>
            <div className={'text-gray-200 tracking-wide'}>A virtual monster also known as a virtual pet, artificial pet, or pet-raising simulation is a type
              of artificial human companion. They are usually kept for companionship or enjoyment.
              $VIGIMON comes with 32 unique pets as NFTs named after crypto influencers.
            </div>
          </div>
        </div>
        <div className={'grid grid-cols-1 lg:grid-cols-2 gap-4 h-full w-full'}>
          <img src={require('./assets/images/pet1.png').default} className={'mx-auto h-56 sm:h-96 w-56 sm:w-96 object-contain'} />
          <div className={'flex flex-col justify-start mt-10 space-y-5 w-full px-2 sm:px-20 lg:px-0 lg:w-96 text-center lg:text-left'}>
            <div className={'text-white text-5xl'}>Community Oriented</div>
            <div className={'text-gray-200 tracking-wide'}>$Vigimon is fully decentralized and owned by its fun, engaging and pets loving community.
              Each Virtual Pet holder will get access to voting rights for nominating the KOL of the week for
              marketing purposes to create a unique atmosphere with their Virtual Pets
            </div>
          </div>
        </div>
        <div className={'grid grid-cols-1 lg:grid-cols-2 gap-4 h-full w-full'}>
          <img src={require('./assets/images/pet2.png').default} className={'mx-auto h-56 sm:h-96 w-56 sm:w-96 object-contain'} />
          <div className={'flex flex-col justify-start mt-10 space-y-5 w-full px-2 sm:px-20 lg:px-0 lg:w-96 text-center lg:text-left'}>
            <div className={'text-white text-5xl'}>Secure and Safety</div>
            <div className={'text-gray-200 tracking-wide'}>The $VIGIMON smart contract will be audited to ensure the security in check before launch,
              further adding a security layer to our NFTs smart contract by adapting Chainlink VRF for
              randomness. That means next to zero risk to our users.
            </div>
          </div>
        </div>
      </div>
      <div className={'pt-10 pb-16'} id={'nfts'}>
        <div className={'flex justify-center items-center text-5xl font-semibold text-white my-10'}>NFTS</div>

        <div className="tech-slideshow">
          <div className="mover-1 flex justify-between items-center">
            <img src={require('./assets/images/pets/Alex Greco Slider.png').default} className={'h-80 w-80 object-contain'} />
            <img src={require('./assets/images/pets/Arzano Slider.png').default} className={'h-80 w-80 object-contain z-10'} />
            <img src={require('./assets/images/pets/Ceasers Slider.png').default} className={'h-80 w-80 object-contain'} />
            <img src={require('./assets/images/pets/Gollum Pet Slider.png').default} className={'h-80 w-80 object-contain'} />
            <img src={require('./assets/images/pets/IMG_8169 2.PNG').default} className={'h-80 w-80 object-contain'} />
            <img src={require('./assets/images/pets/Lambo Slider.png').default} className={'h-80 w-80 object-contain'} />
            <img src={require('./assets/images/pets/Saul Pinksale Slider.png').default} className={'h-80 w-80 object-contain'} />
            <img src={require('./assets/images/pets/Venom Slider Pet.png').default} className={'h-80 w-80 object-contain'} />
            <img src={require('./assets/images/pets/Z Lounge Slider.png').default} className={'h-80 w-80 object-contain'} />
            <img src={require('./assets/images/pets/Alex Greco Slider.png').default} className={'h-80 w-80 object-contain'} />
            <img src={require('./assets/images/pets/Arzano Slider.png').default} className={'h-80 w-80 object-contain z-10'} />
            <img src={require('./assets/images/pets/Ceasers Slider.png').default} className={'h-80 w-80 object-contain'} />
            <img src={require('./assets/images/pets/Gollum Pet Slider.png').default} className={'h-80 w-80 object-contain'} />
            <img src={require('./assets/images/pets/IMG_8169 2.PNG').default} className={'h-80 w-80 object-contain'} />
            <img src={require('./assets/images/pets/Lambo Slider.png').default} className={'h-80 w-80 object-contain'} />
            <img src={require('./assets/images/pets/Saul Pinksale Slider.png').default} className={'h-80 w-80 object-contain'} />
            <img src={require('./assets/images/pets/Venom Slider Pet.png').default} className={'h-80 w-80 object-contain'} />
            <img src={require('./assets/images/pets/Z Lounge Slider.png').default} className={'h-80 w-80 object-contain'} />
          </div>
        </div>
        {account ? (
          <div className="mint-area flex justify-center flex-col items-center ">
            <div className={'flex w-full justify-center items-center text-5xl font-semibold text-white my-10'}>MINT</div>

            <div className='flex w-1/3 justify-center items-center flex-col'>
              <div className='mint_amount flex flex-row'>
                <button className="rounded-full w-8 ctrl-number" onClick={subMintNumber}>
                  -
                </button>
                <input
                  type="number"
                  id="first_name"
                  value={mintAmount}
                  readOnly
                  className="rounded flex text-black ml-5 mr-5" required />
                <button className="rounded-full w-8 ctrl-number" onClick={addMintNumber}>
                  +
                </button>
              </div>
              <div>
                {/* <input className={'flex bg-red-900 text-white mt-10'} type='button' value={'MINT NOW'} /> */}
                <button onClick={mintNow} className={'flex justify-center items-center rounded-full px-6 py-2 mt-10 text-sm text-white relative h-10 cta-button'}>
                  <img src={require('./assets/images/btn.png').default} className={'absolute h-14 w-48'} style={{ zIndex: -1 }} />
                  MINT NOW
                </button>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className={'pt-10 pb-16'} id={'tokenomics'}>
          <div className={'flex justify-center items-center text-5xl font-semibold text-white mt-10'}>Tokenomics</div>
          <div className={'mt-5 text-center text-2xl text-white font-medium'}>Total Supply: 1,000,000,000,000</div>
          <Chart
            chartType="PieChart"
            data={data}
            options={options}
            width={"100%"}
            height={"500px"}
          />
        </div>
        <div className={'pt-10 pb-16'} id={'partners'}>
          <div className={'flex justify-center items-center text-5xl font-semibold text-white mt-10'}>Partners</div>
          <div className={'flex flex-col sm:flex-row justify-center items-center space-y-8 sm:space-y-0 space-x-0 sm:space-x-10 mt-20'}>
            <a href={'https://chain.link'} target={'_blank'} className={'flex justify-center items-center rounded-full px-6 py-2 text-sm text-white relative h-10 w-48 cta-button'}>
              <img src={require('./assets/images/btn.png').default} className={'absolute h-16 w-48'} style={{ zIndex: -1 }} />
              <img src={require('./assets/images/Chainlink_Logo_Blue.svg').default} className={'h-16'} />
            </a>
            <a href={'https://pinksale.finance'} target={'_blank'} className={'flex justify-center items-center rounded-full px-6 py-2 text-sm text-white relative h-10 w-48 cta-button'}>
              <img src={require('./assets/images/btn.png').default} className={'absolute h-16 w-48'} style={{ zIndex: -1 }} />
              <img src={require('./assets/images/PinkSale.svg').default} className={'h-16'} />
            </a>
          </div>
        </div>
        <div className={'relative mt-20'} id={'team'}>
          <div className={'space-y-5 max-w-5xl mx-auto  px-4 lg:px-0'}>
            <div className={'flex justify-center items-center text-5xl font-semibold text-white mt-10 mb-10 sm:mb-20'}>MEET THE TEAM</div>
            <div className={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-7 gap-y-5'}>
              <div className={'space-y-2'}>
                <img src={require('./assets/images/jaymoon.jpg').default} className={'w-full rounded-lg'} />
                <div className={'flex items-center space-x-4'}>
                  <div className={'text-2xl text-white'}>Jay Moon</div>
                  <a className={'cursor-pointer hover:text-gray-100'} href={'https://www.linkedin.com/authwall?trk=gf&trkInfo=AQHKurUz0KtZzgAAAYQp8DFwaHqHN3YklHNjvpS7o3cb1VBVrSdM8SfBSqEb7OCLqymH_uEjHTwj5hY9C0T0Vz0TzUFCOV_ssfsCYlYSV3cAoED9V1CL4-cTven9HgoCjrFI2_8=&original_referer=https://www.black-sheep.xyz/&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fjaydoon-moon-14760a244%2F'} target={'_blank'}><img
                    src={require('./assets/images/linkedin.svg').default} /> </a>
                </div>
                <div className={'text-lg font-light text-gray-200 text-left'}>Marketer/Dev</div>
              </div>
              <div className={'space-y-2'}>
                <img src={require('./assets/images/james.jpg').default} className={'w-full rounded-lg'} />
                <div className={'flex items-center space-x-4'}>
                  <div className={'text-2xl text-white'}>James Wu</div>
                  <a className={'cursor-pointer hover:text-gray-100'} href={'https://www.linkedin.com/in/james-wu-599462202/'} target={'_blank'}><img
                    src={require('./assets/images/linkedin.svg').default} /> </a>
                </div>
                <div className={'text-lg font-light text-gray-200 text-left'}>Co-Founder/CTO</div>
              </div>
              <div className={'space-y-2'}>
                <img src={require('./assets/images/gusto.jpg').default} className={'w-full rounded-lg'} />
                <div className={'flex items-center space-x-4'}>
                  <div className={'text-2xl text-white'}>Gusto Art London</div>
                  <a className={'cursor-pointer hover:text-gray-100'} href={'https://twitter.com/gustoart?s=21&t=4y0Bw27BHs4Vp_7l7MWlyg'} target={'_blank'}><img
                    src={require('./assets/images/icon-twitter.svg').default} /> </a>
                </div>
                <div className={'text-lg font-light text-gray-200 text-left'}>Co Founder/Creative Artist</div>
              </div>
            </div>

          </div>

        </div>
        <div className={'px-5 lg:px-32 py-5 sm:py-10 flex justify-between items-center w-full'} id={'footer'}>
          <div className={'text-xs'}>@2022 Virtual Monsters | Terms & Conditions</div>
          <div className={'flex items-center space-x-5'}>
            <a className={'w-9 h-9 rounded-full flex justify-center items-center bg-icon cursor-pointer'}>
              <img src={require('./assets/images/icon-twitter.svg').default} />
            </a>
            <a className={'w-9 h-9 rounded-full flex justify-center items-center bg-icon cursor-pointer'}>
              <img src={require('./assets/images/icon-discord.svg').default} />
            </a>
            <a className={'w-9 h-9 rounded-full flex justify-center items-center bg-icon cursor-pointer'} href={'https://t.me/Virtualmonsters'} target={'_blank'}>
              <img src={require('./assets/images/telegram.svg').default} />
            </a>
            <a className={'w-9 h-9 rounded-full flex justify-center items-center bg-icon cursor-pointer'}>
              <img src={require('./assets/images/tiktok.svg').default} className={'w-5 h-5'} />
            </a>
          </div>
        </div>
        <Modal
          isOpen={isOpen}
          // onAfterOpen={afterOpenModal}
          closeModal={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
          onRequestClose={closeModal}
        >
          <div style={{ borderBottom: '1px solid silver', padding: '3px' }}>
            <img
              src={Cancel}
              style={{
                background: 'transparent',
                width: '25px',
                color: 'white',
                border: '0',
                float: 'right',
              }}
              onClick={closeModal}
            />
            <br />
            Connect Wallet
          </div>
          <br />
          {wallets.map((wallet) => (
            <div
              key={wallet.name}
              className="wallet-modal__list__item"
              onClick={() => handleLogin(wallet.name)}
            >
              <font className="font-size-14">{wallet.name}</font>
              <img src={wallet.icon} alt={wallet.name} />
            </div>
          ))}
        </Modal>
      </div>
      <ToastsContainer store={ToastsStore} />
    </div>
  );
}

export default App;
