/**
 * Task Priority Value Object
 * 任務優先級
 */
export class TaskPriority {
  private static readonly VALID_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
  private static readonly PRIORITY_WEIGHTS = {
    low: 1,
    medium: 2,
    high: 3,
    urgent: 4,
  };

  private readonly value: (typeof TaskPriority.VALID_PRIORITIES)[number];

  private constructor(value: (typeof TaskPriority.VALID_PRIORITIES)[number]) {
    this.value = value;
  }

  /**
   * 從字串建立 TaskPriority
   */
  static create(priority: string): TaskPriority {
    if (!this.VALID_PRIORITIES.includes(priority as any)) {
      throw new Error(
        `Invalid task priority: ${priority}. Must be one of: ${this.VALID_PRIORITIES.join(', ')}`
      );
    }
    return new TaskPriority(priority as any);
  }

  /**
   * 建立低優先級
   */
  static createLow(): TaskPriority {
    return new TaskPriority('low');
  }

  /**
   * 建立中優先級
   */
  static createMedium(): TaskPriority {
    return new TaskPriority('medium');
  }

  /**
   * 建立高優先級
   */
  static createHigh(): TaskPriority {
    return new TaskPriority('high');
  }

  /**
   * 建立緊急優先級
   */
  static createUrgent(): TaskPriority {
    return new TaskPriority('urgent');
  }

  getValue(): string {
    return this.value;
  }

  /**
   * 取得優先級權重（用於排序）
   */
  getWeight(): number {
    return TaskPriority.PRIORITY_WEIGHTS[this.value];
  }

  /**
   * 比較優先級高低
   * @returns 正數表示此優先級較高，負數表示較低，0 表示相同
   */
  compareTo(other: TaskPriority): number {
    return this.getWeight() - other.getWeight();
  }

  isHigherThan(other: TaskPriority): boolean {
    return this.compareTo(other) > 0;
  }

  isLowerThan(other: TaskPriority): boolean {
    return this.compareTo(other) < 0;
  }

  isLow(): boolean {
    return this.value === 'low';
  }

  isMedium(): boolean {
    return this.value === 'medium';
  }

  isHigh(): boolean {
    return this.value === 'high';
  }

  isUrgent(): boolean {
    return this.value === 'urgent';
  }

  equals(other: TaskPriority): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
