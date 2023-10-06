import * as assert from "assert";

export function isException(error: any) {
    let strError = error.toString()
    return (
        strError.includes('invalid opcode') ||
        strError.includes('invalid JUMP') ||
        strError.includes('revert')
    );
}

export function ensureException(error: any) {
    assert.equal(isException(error), true);
}

export async function expectFailure(call: any) {
    try {
        await call
    } catch (error) {
        return ensureException(error);
    }

    assert.fail('should fail');
}
