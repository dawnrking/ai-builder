import type { CPU, GPU, Motherboard, RAM, Storage, PSU, Case, Cooler } from '../types'

export const cpuList: CPU[] = [
  {
    id: 'cpu-001',
    type: 'cpu',
    name: 'Intel Core i9-14900K',
    brand: 'Intel',
    model: 'i9-14900K',
    price: 4299,
    image: '/images/cpu-intel-14900k.png',
    benchmark: 59000,
    tdp: 253,
    releaseDate: '2023-10',
    specs: {
      cores: 24,
      threads: 32,
      baseClock: 3.2,
      boostClock: 6.0,
      cache: '36MB',
      socket: 'LGA1700',
      tdp: 253,
      architecture: 'Raptor Lake Refresh'
    }
  },
  {
    id: 'cpu-002',
    type: 'cpu',
    name: 'Intel Core i7-14700K',
    brand: 'Intel',
    model: 'i7-14700K',
    price: 3199,
    image: '/images/cpu-intel-14700k.png',
    benchmark: 52000,
    tdp: 253,
    releaseDate: '2023-10',
    specs: {
      cores: 20,
      threads: 28,
      baseClock: 3.4,
      boostClock: 5.6,
      cache: '33MB',
      socket: 'LGA1700',
      tdp: 253,
      architecture: 'Raptor Lake Refresh'
    }
  },
  {
    id: 'cpu-003',
    type: 'cpu',
    name: 'AMD Ryzen 9 7950X',
    brand: 'AMD',
    model: 'Ryzen 9 7950X',
    price: 3999,
    image: '/images/cpu-amd-7950x.png',
    benchmark: 56000,
    tdp: 170,
    releaseDate: '2022-09',
    specs: {
      cores: 16,
      threads: 32,
      baseClock: 4.5,
      boostClock: 5.7,
      cache: '80MB',
      socket: 'AM5',
      tdp: 170,
      architecture: 'Zen 4'
    }
  },
  {
    id: 'cpu-004',
    type: 'cpu',
    name: 'AMD Ryzen 7 7800X3D',
    brand: 'AMD',
    model: 'Ryzen 7 7800X3D',
    price: 2999,
    image: '/images/cpu-amd-7800x3d.png',
    benchmark: 34000,
    tdp: 120,
    releaseDate: '2023-04',
    specs: {
      cores: 8,
      threads: 16,
      baseClock: 4.2,
      boostClock: 5.0,
      cache: '104MB',
      socket: 'AM5',
      tdp: 120,
      architecture: 'Zen 4 3D V-Cache'
    }
  },
  {
    id: 'cpu-005',
    type: 'cpu',
    name: 'Intel Core i5-14600K',
    brand: 'Intel',
    model: 'i5-14600K',
    price: 2299,
    image: '/images/cpu-intel-14600k.png',
    benchmark: 38000,
    tdp: 181,
    releaseDate: '2023-10',
    specs: {
      cores: 14,
      threads: 20,
      baseClock: 3.5,
      boostClock: 5.3,
      cache: '24MB',
      socket: 'LGA1700',
      tdp: 181,
      architecture: 'Raptor Lake Refresh'
    }
  }
]

export const gpuList: GPU[] = [
  {
    id: 'gpu-001',
    type: 'gpu',
    name: 'NVIDIA GeForce RTX 4090',
    brand: 'NVIDIA',
    model: 'RTX 4090',
    price: 14999,
    image: '/images/gpu-rtx4090.png',
    benchmark: 36000,
    tdp: 450,
    releaseDate: '2022-10',
    specs: {
      vram: 24,
      vramType: 'GDDR6X',
      baseClock: 2235,
      boostClock: 2520,
      cudaCores: 16384,
      tdp: 450,
      length: 336,
      slots: 3.5
    }
  },
  {
    id: 'gpu-002',
    type: 'gpu',
    name: 'NVIDIA GeForce RTX 4080 Super',
    brand: 'NVIDIA',
    model: 'RTX 4080 Super',
    price: 8499,
    image: '/images/gpu-rtx4080s.png',
    benchmark: 28000,
    tdp: 320,
    releaseDate: '2024-01',
    specs: {
      vram: 16,
      vramType: 'GDDR6X',
      baseClock: 2290,
      boostClock: 2550,
      cudaCores: 10240,
      tdp: 320,
      length: 304,
      slots: 2.5
    }
  },
  {
    id: 'gpu-003',
    type: 'gpu',
    name: 'NVIDIA GeForce RTX 4070 Ti Super',
    brand: 'NVIDIA',
    model: 'RTX 4070 Ti Super',
    price: 6499,
    image: '/images/gpu-rtx4070tis.png',
    benchmark: 24000,
    tdp: 285,
    releaseDate: '2024-01',
    specs: {
      vram: 16,
      vramType: 'GDDR6X',
      baseClock: 2340,
      boostClock: 2610,
      cudaCores: 8448,
      tdp: 285,
      length: 285,
      slots: 2.5
    }
  },
  {
    id: 'gpu-004',
    type: 'gpu',
    name: 'AMD Radeon RX 7900 XTX',
    brand: 'AMD',
    model: 'RX 7900 XTX',
    price: 7999,
    image: '/images/gpu-rx7900xtx.png',
    benchmark: 26000,
    tdp: 355,
    releaseDate: '2022-12',
    specs: {
      vram: 24,
      vramType: 'GDDR6',
      baseClock: 1900,
      boostClock: 2500,
      streamProcessors: 6144,
      tdp: 355,
      length: 287,
      slots: 2.5
    }
  },
  {
    id: 'gpu-005',
    type: 'gpu',
    name: 'NVIDIA GeForce RTX 4060 Ti',
    brand: 'NVIDIA',
    model: 'RTX 4060 Ti',
    price: 3199,
    image: '/images/gpu-rtx4060ti.png',
    benchmark: 16000,
    tdp: 160,
    releaseDate: '2023-05',
    specs: {
      vram: 8,
      vramType: 'GDDR6',
      baseClock: 2310,
      boostClock: 2535,
      cudaCores: 4352,
      tdp: 160,
      length: 240,
      slots: 2
    }
  }
]

export const motherboardList: Motherboard[] = [
  {
    id: 'mb-001',
    type: 'motherboard',
    name: 'ASUS ROG Maximus Z790 Hero',
    brand: 'ASUS',
    model: 'ROG Maximus Z790 Hero',
    price: 5999,
    image: '/images/mb-asus-z790hero.png',
    releaseDate: '2022-10',
    specs: {
      socket: 'LGA1700',
      chipset: 'Z790',
      formFactor: 'ATX',
      memorySlots: 4,
      maxMemory: 192,
      memoryType: 'DDR5',
      pciSlots: 3,
      m2Slots: 5,
      sataSlots: 6
    }
  },
  {
    id: 'mb-002',
    type: 'motherboard',
    name: 'MSI MEG Z790 ACE',
    brand: 'MSI',
    model: 'MEG Z790 ACE',
    price: 4999,
    image: '/images/mb-msi-z790ace.png',
    releaseDate: '2022-10',
    specs: {
      socket: 'LGA1700',
      chipset: 'Z790',
      formFactor: 'E-ATX',
      memorySlots: 4,
      maxMemory: 192,
      memoryType: 'DDR5',
      pciSlots: 4,
      m2Slots: 5,
      sataSlots: 8
    }
  },
  {
    id: 'mb-003',
    type: 'motherboard',
    name: 'ASUS ROG Crosshair X670E Hero',
    brand: 'ASUS',
    model: 'ROG Crosshair X670E Hero',
    price: 5499,
    image: '/images/mb-asus-x670ehero.png',
    releaseDate: '2022-09',
    specs: {
      socket: 'AM5',
      chipset: 'X670E',
      formFactor: 'ATX',
      memorySlots: 4,
      maxMemory: 128,
      memoryType: 'DDR5',
      pciSlots: 3,
      m2Slots: 4,
      sataSlots: 6
    }
  },
  {
    id: 'mb-004',
    type: 'motherboard',
    name: 'Gigabyte B650 AORUS Elite AX',
    brand: 'Gigabyte',
    model: 'B650 AORUS Elite AX',
    price: 1699,
    image: '/images/mb-gb-b650elite.png',
    releaseDate: '2022-10',
    specs: {
      socket: 'AM5',
      chipset: 'B650',
      formFactor: 'ATX',
      memorySlots: 4,
      maxMemory: 128,
      memoryType: 'DDR5',
      pciSlots: 2,
      m2Slots: 3,
      sataSlots: 4
    }
  }
]

export const ramList: RAM[] = [
  {
    id: 'ram-001',
    type: 'ram',
    name: 'G.SKILL Trident Z5 RGB DDR5-6400',
    brand: 'G.SKILL',
    model: 'Trident Z5 RGB',
    price: 1599,
    image: '/images/ram-gskill-z5.png',
    releaseDate: '2022-10',
    specs: {
      capacity: 32,
      speed: 6400,
      type: 'DDR5',
      timing: 'CL32-39-39-102',
      voltage: 1.4,
      modules: 2
    }
  },
  {
    id: 'ram-002',
    type: 'ram',
    name: 'Corsair Dominator Platinum RGB DDR5-6000',
    brand: 'Corsair',
    model: 'Dominator Platinum RGB',
    price: 1899,
    image: '/images/ram-corsair-dominator.png',
    releaseDate: '2022-09',
    specs: {
      capacity: 64,
      speed: 6000,
      type: 'DDR5',
      timing: 'CL30-36-36-76',
      voltage: 1.35,
      modules: 2
    }
  },
  {
    id: 'ram-003',
    type: 'ram',
    name: 'Kingston Fury Beast DDR5-5600',
    brand: 'Kingston',
    model: 'Fury Beast',
    price: 699,
    image: '/images/ram-kingston-fury.png',
    releaseDate: '2022-08',
    specs: {
      capacity: 32,
      speed: 5600,
      type: 'DDR5',
      timing: 'CL40-40-40-80',
      voltage: 1.25,
      modules: 2
    }
  }
]

export const storageList: Storage[] = [
  {
    id: 'ssd-001',
    type: 'storage',
    name: 'Samsung 990 Pro 2TB',
    brand: 'Samsung',
    model: '990 Pro',
    price: 1299,
    image: '/images/ssd-samsung-990pro.png',
    releaseDate: '2022-10',
    specs: {
      capacity: 2000,
      interface: 'PCIe 4.0 x4',
      readSpeed: 7450,
      writeSpeed: 6900,
      formFactor: 'M.2 2280',
      type: 'NVMe'
    }
  },
  {
    id: 'ssd-002',
    type: 'storage',
    name: 'WD Black SN850X 1TB',
    brand: 'Western Digital',
    model: 'Black SN850X',
    price: 799,
    image: '/images/ssd-wd-sn850x.png',
    releaseDate: '2022-08',
    specs: {
      capacity: 1000,
      interface: 'PCIe 4.0 x4',
      readSpeed: 7300,
      writeSpeed: 6300,
      formFactor: 'M.2 2280',
      type: 'NVMe'
    }
  },
  {
    id: 'ssd-003',
    type: 'storage',
    name: 'Crucial T700 2TB',
    brand: 'Crucial',
    model: 'T700',
    price: 2199,
    image: '/images/ssd-crucial-t700.png',
    releaseDate: '2023-05',
    specs: {
      capacity: 2000,
      interface: 'PCIe 5.0 x4',
      readSpeed: 12400,
      writeSpeed: 11800,
      formFactor: 'M.2 2280',
      type: 'NVMe'
    }
  }
]

export const psuList: PSU[] = [
  {
    id: 'psu-001',
    type: 'psu',
    name: 'Corsair HX1500i',
    brand: 'Corsair',
    model: 'HX1500i',
    price: 2999,
    image: '/images/psu-corsair-hx1500i.png',
    releaseDate: '2023-01',
    specs: {
      wattage: 1500,
      efficiency: '80+ Platinum',
      modular: 'Full',
      formFactor: 'ATX',
      fanSize: 140
    }
  },
  {
    id: 'psu-002',
    type: 'psu',
    name: 'Seasonic PRIME TX-1000',
    brand: 'Seasonic',
    model: 'PRIME TX-1000',
    price: 2299,
    image: '/images/psu-seasonic-tx1000.png',
    releaseDate: '2022-06',
    specs: {
      wattage: 1000,
      efficiency: '80+ Titanium',
      modular: 'Full',
      formFactor: 'ATX',
      fanSize: 135
    }
  },
  {
    id: 'psu-003',
    type: 'psu',
    name: 'EVGA SuperNOVA 850 G6',
    brand: 'EVGA',
    model: 'SuperNOVA 850 G6',
    price: 999,
    image: '/images/psu-evga-850g6.png',
    releaseDate: '2021-10',
    specs: {
      wattage: 850,
      efficiency: '80+ Gold',
      modular: 'Full',
      formFactor: 'ATX',
      fanSize: 135
    }
  }
]

export const caseList: Case[] = [
  {
    id: 'case-001',
    type: 'case',
    name: 'Lian Li O11 Dynamic EVO',
    brand: 'Lian Li',
    model: 'O11 Dynamic EVO',
    price: 1299,
    image: '/images/case-lianli-o11evo.png',
    releaseDate: '2022-02',
    specs: {
      formFactor: 'ATX/E-ATX',
      maxGpuLength: 420,
      maxCoolerHeight: 167,
      driveBays: '4x 2.5", 2x 3.5"',
      fans: '10x 120mm',
      material: 'Aluminum/Glass'
    }
  },
  {
    id: 'case-002',
    type: 'case',
    name: 'NZXT H9 Elite',
    brand: 'NZXT',
    model: 'H9 Elite',
    price: 1699,
    image: '/images/case-nzxt-h9elite.png',
    releaseDate: '2022-09',
    specs: {
      formFactor: 'ATX/E-ATX',
      maxGpuLength: 435,
      maxCoolerHeight: 165,
      driveBays: '2x 2.5", 1x 3.5"',
      fans: '9x 120mm',
      material: 'Steel/Glass'
    }
  },
  {
    id: 'case-003',
    type: 'case',
    name: 'Fractal Design Torrent',
    brand: 'Fractal Design',
    model: 'Torrent',
    price: 1399,
    image: '/images/case-fractal-torrent.png',
    releaseDate: '2021-10',
    specs: {
      formFactor: 'ATX/E-ATX',
      maxGpuLength: 461,
      maxCoolerHeight: 188,
      driveBays: '4x 2.5", 4x 3.5"',
      fans: '5x 140mm + 2x 180mm',
      material: 'Steel/Glass'
    }
  }
]

export const coolerList: Cooler[] = [
  {
    id: 'cooler-001',
    type: 'cooler',
    name: 'NZXT Kraken Z73 RGB',
    brand: 'NZXT',
    model: 'Kraken Z73 RGB',
    price: 2199,
    image: '/images/cooler-nzxt-z73.png',
    releaseDate: '2022-03',
    specs: {
      type: 'AIO',
      tdp: 350,
      fanSize: 120,
      radiatorSize: 360,
      noise: 36
    }
  },
  {
    id: 'cooler-002',
    type: 'cooler',
    name: 'Noctua NH-D15 chromax.black',
    brand: 'Noctua',
    model: 'NH-D15 chromax.black',
    price: 799,
    image: '/images/cooler-noctua-d15.png',
    releaseDate: '2020-05',
    specs: {
      type: 'Air',
      tdp: 250,
      fanSize: 140,
      height: 165,
      noise: 24.6
    }
  },
  {
    id: 'cooler-003',
    type: 'cooler',
    name: 'Corsair iCUE H150i Elite LCD',
    brand: 'Corsair',
    model: 'iCUE H150i Elite LCD',
    price: 1999,
    image: '/images/cooler-corsair-h150i.png',
    releaseDate: '2022-08',
    specs: {
      type: 'AIO',
      tdp: 320,
      fanSize: 120,
      radiatorSize: 360,
      noise: 35
    }
  }
]
