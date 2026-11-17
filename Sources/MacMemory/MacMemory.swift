import Darwin

/// A Mac's memory right now, split the way Activity Monitor and MacXray show it: what apps use, what the system
/// has wired in place, what macOS compressed, cached files and what's free, with memory pressure and swap.
///
///     if let memory = MacMemory.now() {
///         print(memory.used, "of", memory.total, "bytes in use, pressure", memory.pressure)
///     }
///
/// This is how MacXray reads memory.
public struct MacMemory: Sendable {
    public enum Pressure: String, Sendable {
        /// Plenty of room: macOS uses spare memory for caches, which is good.
        case normal
        /// Getting tight: macOS is compressing memory and may start using the disk.
        case warning
        /// Out of room: apps slow down while macOS moves memory to the disk.
        case critical
    }

    /// Physical memory in this Mac, in bytes.
    public let total: Int
    /// What apps and their helpers are using.
    public let app: Int
    /// Memory the system locked in place (the kernel, drivers, the GPU). It can't be moved or compressed.
    public let wired: Int
    /// Memory macOS squeezed to make room, instead of writing it to the disk.
    public let compressed: Int
    /// Copies of files kept in memory in case they're needed again; freed as soon as an app needs room.
    public let cached: Int
    /// Not used at all.
    public let free: Int
    /// Swap: memory macOS moved to the disk, in bytes, and how much swap space there is.
    public let swapUsed: Int
    public let swapTotal: Int
    public let pressure: Pressure

    /// In use, as macOS counts it: app memory, wired and compressed.
    public var used: Int { app + wired + compressed }
    /// What the other groups don't account for, such as memory reserved by the GPU.
    public var other: Int { max(0, total - app - wired - compressed - cached - free) }

    /// Reads the kernel's page counts now. nil if the kernel doesn't answer.
    public static func now() -> MacMemory? {
        var stats = vm_statistics64()
        var count = mach_msg_type_number_t(MemoryLayout<vm_statistics64_data_t>.stride / MemoryLayout<integer_t>.stride)
        let result = withUnsafeMutablePointer(to: &stats) {
            $0.withMemoryRebound(to: integer_t.self, capacity: Int(count)) { host_statistics64(mach_host_self(), HOST_VM_INFO64, $0, &count) }
        }
        guard result == KERN_SUCCESS else { return nil }

        let page = sysctl("hw.pagesize") ?? 16384
        let bytes = { (pages: UInt32) in Int(pages) * page }
        var swap = xsw_usage()
        var size = MemoryLayout<xsw_usage>.size
        sysctlbyname("vm.swapusage", &swap, &size, nil, 0)
        let level = sysctl("kern.memorystatus_vm_pressure_level") ?? 1

        return MacMemory(
            total: sysctl("hw.memsize") ?? 0,
            app: max(0, bytes(stats.internal_page_count) - bytes(stats.purgeable_count)),
            wired: bytes(stats.wire_count),
            compressed: bytes(stats.compressor_page_count),
            cached: bytes(stats.external_page_count) + bytes(stats.purgeable_count),
            free: bytes(stats.free_count) + bytes(stats.speculative_count),
            swapUsed: Int(swap.xsu_used),
            swapTotal: Int(swap.xsu_total),
            pressure: level >= 4 ? .critical : level >= 2 ? .warning : .normal
        )
    }

    private static func sysctl(_ name: String) -> Int? {
        var value = 0
        var size = MemoryLayout<Int>.size
        return sysctlbyname(name, &value, &size, nil, 0) == 0 ? value : nil
    }
}
