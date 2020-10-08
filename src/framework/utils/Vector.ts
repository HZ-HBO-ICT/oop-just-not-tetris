/**
 * This class represents a mathematical immutable Vector. Immutable means that
 * it is not allowed to change the internal state of the vector. Instead, 
 * there are different computation methods that perform different computations
 * like adding, subtracting, scaling and mirroring. These methods all return a
 * new Vector object or just a number.
 * 
 * @author BugSlayer
 */
class Vector {

    public readonly x : number;
    public readonly y : number;

    private _size: number = null;
    private _angle: number = null;

    /**
     * Constructs a new Vector.
     * 
     * @param x the x-portion of this vector
     * @param y the y-portion of this vector
     */
    public constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }

    /**
     * Factory method that constructs a vector from the given size and angle
     * 
     * @param size the length of the vector 
     * @param angle the angle of the vector (in radians)
     */
    public static fromSizeAndAngle(size: number, angle: number) : Vector {
        let x = size * Math.sin(angle);
        let y = size * Math.cos(angle);
        return new Vector(x, y);
    }

    /**
     * Returns the size or length of this Vector
     * 
     * @return the size or length of this Vector
     */
    public get size(): number
    {
        if (!this._size) {
            // Calculate only once for performance reasons
            this._size = Math.sqrt(Math.pow(this.x, 2) + 
                                   Math.pow(this.y, 2));

        }
        return this._size;
    }

    /**
     * Returns the angle between this vector and the X-axis in radians as a 
     * value between -PI/2 and PI/2 radians.
     * 
     * @return the angle between this vector and the X-axis in radians as a 
     * value between -PI/2 and PI/2 radians.
     */
    public get angle(): number
    {
        if (!this._angle) {
            // Calculate only once for performance reasons
            this._angle = Math.atan(this.y / this.x);
        }
        return this._angle;
    }


    /**
     * Returns a new Vector representing the sum of this Vector and the given 
     * input.
     * 
     * @param input the Vector that must be subtracted to this Vector
     * @return a new Vector representing the sum of this Vector and the input.
     */
    public add(input: Vector) : Vector
    {
        return new Vector(
            this.x + input.x,
            this.y + input.y
        );
    }

    /**
     * Returns a new Vector representing the difference between this Vector and 
     * the given input.
     * 
     * @param input the Vector that must be subtracted to this Vector
     * @return a new Vector representing the difference between this Vector and 
     * the input.
     */
    public subtract(input: Vector) : Vector
    {
        return new Vector(
            this.x - input.x,
            this.y - input.y
        );
    }

    /**
     * Returns a new Vector representing the result of the multiplication of 
     * this vector and the specified scalar.
     * 
     * @param scalar the scalar that should be used in the calculation
     * @return a new Vector representing the result of the multiplication of 
     * this vector and the specified scalar.
     */
    public scale(scalar: number) : Vector
    {
        return new Vector(
            this.x * scalar,
            this.y * scalar
        );
    }

    /**
     * Returns a new Vector representing the normalized vector. This vector has 
     * the same angle but the size = 1.
     * 
     * @return a new Vector representing the normalized vector.
     */
    public normalize() : Vector
    {
        return Vector.fromSizeAndAngle(1, this.angle);
    }

    /**
     * Returns a new Vector representing the mirrored version of this vector 
     * with respect to the X-axis. This means that the
     * Y-portion of this vector will be multiplied by -1.
     * 
     * @return a new Vector representing the mirrored version of this vector 
     * with respect to the X-axis.
     */
    public mirror_X(): Vector
    {
        return new Vector(this.x, this.y * -1);
    }

    /**
     * Returns a new Vector representing the mirrored version of this vector 
     * with respect to the Y-axis. This means that the
     * X-portion of this vector will be multiplied by -1.
     * 
     * @return a new Vector representing the mirrored version of this vector 
     * with respect to the X-axis.
     */
    public mirror_Y(): Vector
    {
        return new Vector(this.x * -1, this.y);
    }

    /**
     * Returns the distance between the endpoints of this vector and the given 
     * input.
     * 
     * @param input the Vector that must be subtracted to this Vector
     * @return the distance between the endpoints of this vector and the input.
     */
    public distance(input: Vector): number
    {
        return this.subtract(input).size;
    }

}