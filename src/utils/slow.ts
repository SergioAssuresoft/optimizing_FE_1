export function slowCompute(n: number) {
    let x = 0
    for (let i = 0; i < 5e6 + n; i++) x += i % 7
    return x
}