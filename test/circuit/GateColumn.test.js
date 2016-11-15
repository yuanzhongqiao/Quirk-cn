import {Suite, assertThat, assertTrue, assertFalse} from "test/TestUtil.js"
import {GateColumn} from "src/circuit/GateColumn.js"

import {Gates} from "src/gates/AllGates.js"

let suite = new Suite("GateColumn");

suite.test("isEqualTo", () => {
    // Trivial case:
    assertThat(GateColumn.empty(1)).isEqualTo(GateColumn.empty(1));
    assertThat(GateColumn.empty(2)).isNotEqualTo(GateColumn.empty(1));

    // Equivalence groups:
    let groups = [
        [GateColumn.empty(0), GateColumn.empty(0), new GateColumn([]), new GateColumn([])],
        [GateColumn.empty(1), GateColumn.empty(1), new GateColumn([undefined]), new GateColumn([undefined])],
        [GateColumn.empty(2), GateColumn.empty(2), new GateColumn([undefined, undefined]),
            new GateColumn([undefined, undefined])],
        [new GateColumn([Gates.HalfTurns.X]), new GateColumn([Gates.HalfTurns.X])],
        [new GateColumn([Gates.Controls.Control]), new GateColumn([Gates.Controls.Control])],
        [new GateColumn([Gates.HalfTurns.X, undefined]), new GateColumn([Gates.HalfTurns.X, undefined])],
        [new GateColumn([undefined, Gates.HalfTurns.X]), new GateColumn([undefined, Gates.HalfTurns.X])]
    ];
    for (let g1 of groups) {
        for (let g2 of groups) {
            for (let e1 of g1) {
                for (let e2 of g2) {
                    if (g1 === g2) {
                        assertThat(e1).isEqualTo(e2);
                        assertTrue(e1.isEqualTo(e2));
                    } else {
                        assertThat(e1).isNotEqualTo(e2);
                        assertFalse(e1.isEqualTo(e2));
                    }
                }
            }
        }
    }
});

suite.test("isEmpty", () => {
    assertTrue(GateColumn.empty(0).isEmpty());
    assertTrue(GateColumn.empty(1).isEmpty());
    assertTrue(GateColumn.empty(2).isEmpty());
    assertTrue(GateColumn.empty(10).isEmpty());
    assertTrue(new GateColumn([]).isEmpty());
    assertTrue(new GateColumn([undefined]).isEmpty());
    assertTrue(new GateColumn([undefined, undefined]).isEmpty());
    assertFalse(new GateColumn([Gates.Controls.Control]).isEmpty());
    assertFalse(new GateColumn([Gates.Special.SwapHalf]).isEmpty());
    assertFalse(new GateColumn([Gates.HalfTurns.X]).isEmpty());
    assertFalse(new GateColumn([Gates.HalfTurns.X, undefined]).isEmpty());
    assertFalse(new GateColumn([Gates.HalfTurns.X, Gates.HalfTurns.X]).isEmpty());
});

suite.test("swapPairs", () => {
    assertThat(new GateColumn([]).swapPairs()).isEqualTo([]);
    assertThat(new GateColumn([undefined, undefined]).swapPairs()).isEqualTo([]);
    assertThat(new GateColumn([Gates.HalfTurns.X, undefined]).swapPairs()).isEqualTo([]);
    assertThat(new GateColumn([
        Gates.Controls.Control, Gates.Controls.AntiControl, Gates.Special.SwapHalf
    ]).swapPairs()).isEqualTo([]);
    assertThat(new GateColumn([
        Gates.Special.SwapHalf, Gates.Special.SwapHalf
    ]).swapPairs()).isEqualTo([[0, 1]]);
    assertThat(new GateColumn([
        Gates.Special.SwapHalf, undefined, Gates.Controls.AntiControl, Gates.Special.SwapHalf, undefined
    ]).swapPairs()).isEqualTo([[0, 3]]);
});
